<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use App\Services\BookingService;
use App\Services\NotificationService;
use App\Models\Payment;
use App\Models\Refund;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $bookingService;
    protected $notificationService;

    public function __construct(
        PaymentService $paymentService,
        BookingService $bookingService,
        NotificationService $notificationService
    ) {
        $this->paymentService = $paymentService;
        $this->bookingService = $bookingService;
        $this->notificationService = $notificationService;
    }

    /**
     * Process payment for a booking
     */
    public function processPayment(Request $request, $bookingId)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|in:cbe,telebirr',
            'payment_data' => 'nullable|array',
            'payment_proof' => 'required|file|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = $this->bookingService->getBookingById($bookingId);
            
            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }

            // Check if user owns this booking
            if ($booking->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to pay for this booking'
                ], 403);
            }

            // Check if booking is already paid
            if ($booking->payment_status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking is already paid'
                ], 400);
            }

            $pendingProof = Payment::where('booking_id', $booking->id)
                ->where('payment_type', 'rental')
                ->where('status', 'pending_verification')
                ->exists();
            if ($pendingProof) {
                return response()->json([
                    'success' => false,
                    'message' => 'A payment proof for this booking is already awaiting verification.',
                ], 409);
            }

            if ($booking->status !== 'confirmed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment is available only after the vendor approves your rental request.',
                ], 409);
            }

            if (!$booking->vendor || !$booking->vendor->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'This booking has no valid vendor account for payment notifications.',
                ], 409);
            }

            $proofPath = $request->file('payment_proof')->store('payment-proofs', 'public');
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $booking->customer_id,
                'vendor_id' => $booking->vendor_id,
                'amount' => $booking->total_amount,
                'payment_type' => 'rental',
                'payment_method' => $request->payment_method,
                'payment_data' => $request->payment_data,
                'payment_proof_path' => $proofPath,
                'payment_proof_type' => 'screenshot',
                'status' => 'pending_verification',
                'payment_status' => 'pending',
                'proof_verification_status' => 'pending',
            ]);
            $booking->update(['payment_status' => 'pending']);

            $this->notificationService->createNotification(
                $booking->customer_id,
                'payment_pending_verification',
                'Payment Proof Submitted',
                "Your payment proof for booking #{$booking->booking_reference} is awaiting admin verification.",
                "/booking-details/{$booking->id}",
                'medium',
                'payment'
            );
            $this->notificationService->createNotification(
                $booking->vendor->user_id,
                'payment_pending_verification',
                'Payment Awaiting Verification',
                "Payment proof for booking #{$booking->booking_reference} was submitted and is awaiting admin verification.",
                "/vendor/bookings/{$booking->id}",
                'medium',
                'payment'
            );

            return response()->json([
                'success' => true,
                'message' => 'Payment proof submitted. Awaiting admin verification.',
                'payment' => $payment,
                'booking' => $booking->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user payments
     */
    public function index(Request $request)
    {
        try {
            $payments = $this->paymentService->getUserPayments($request->user()->id);

            return response()->json([
                'success' => true,
                'payments' => $payments,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment details
     */
    public function show($id, Request $request)
    {
        try {
            $payment = $this->paymentService->getPaymentDetails($id);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'payment' => $payment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refund payment (Admin only)
     */
    public function refund($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'nullable|numeric|min:0',
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payment = $this->paymentService->refundPayment(
                $id,
                $request->amount,
                $request->reason
            );

            return response()->json([
                'success' => true,
                'message' => 'Payment refunded successfully',
                'payment' => $payment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to refund payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor payment summary
     */
    public function vendorSummary(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $summary = $this->paymentService->getVendorPaymentSummary($vendor->id);

            return response()->json([
                'success' => true,
                'summary' => $summary,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all payments (Admin only)
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = Payment::with(['customer', 'vendor', 'booking'])
                ->orderBy('created_at', 'desc');
            
            if ($request->has('status')) {
                $query->where('payment_status', $request->status);
            }
            
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }
            
            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }
            
            $payments = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'payments' => $payments,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment details (Admin only)
     */
    public function adminShow($id, Request $request)
    {
        try {
            $payment = Payment::with(['customer', 'vendor', 'booking'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'payment' => $payment,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Payment not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Approve a customer-submitted manual payment proof (Admin only).
     */
    public function adminApprove($id, Request $request)
    {
        try {
            $payment = $this->paymentService->approveManualPayment(
                Payment::findOrFail($id),
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Payment approved successfully',
                'payment' => $payment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Reject a customer-submitted manual payment proof (Admin only).
     */
    public function adminReject(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $payment = $this->paymentService->rejectManualPayment(
                Payment::findOrFail($id),
                $request->user()->id,
                $request->input('reason')
            );

            return response()->json([
                'success' => true,
                'message' => 'Payment rejected successfully',
                'payment' => $payment,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Initiate refund (Admin only)
     */
    public function adminRefund($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
            'amount' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payment = Payment::findOrFail($id);
            
            if ($payment->payment_status !== 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only paid payments can be refunded'
                ], 400);
            }

            $refund = $this->paymentService->initiateRefund(
                $payment,
                $request->get('amount', $payment->amount),
                $request->reason,
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Refund initiated successfully',
                'refund' => $refund,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate refund',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all refunds (Admin only)
     */
    public function adminRefunds(Request $request)
    {
        try {
            $query = Refund::with(['payment', 'booking', 'customer', 'vendor', 'initiatedByUser', 'processedByUser'])
                ->orderBy('created_at', 'desc');
            
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }
            
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }
            
            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }
            
            $refunds = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'refunds' => $refunds,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get refunds',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get refund details (Admin only)
     */
    public function adminRefundShow($id, Request $request)
    {
        try {
            $refund = Refund::with(['payment', 'booking', 'customer', 'vendor', 'initiatedByUser', 'processedByUser'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'refund' => $refund,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Refund not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Submit manual payment proof for subscription payments.
     */
    public function submitManualProof(Request $request, $paymentId)
    {
        $validator = Validator::make($request->all(), [
            'payment_method' => 'required|in:cbe,telebirr',
            'proof_file_name' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $payment = Payment::findOrFail($paymentId);

            // Check authorization
            if ($payment->user_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to submit proof for this payment'
                ], 403);
            }

            // Check payment type
            if ($payment->payment_type !== 'subscription') {
                return response()->json([
                    'success' => false,
                    'message' => 'Manual proof is only for subscription payments'
                ], 400);
            }

            // Check payment status
            if ($payment->payment_status === 'paid') {
                return response()->json([
                    'success' => false,
                    'message' => 'This payment is already confirmed as paid'
                ], 400);
            }

            // Update payment with proof submission
            $proofData = [
                'proof_submitted_at' => now(),
                'proof_file_name' => $request->proof_file_name,
            ];

            if ($payment->payment_data) {
                $paymentData = is_array($payment->payment_data) ? $payment->payment_data : json_decode($payment->payment_data, true);
                $paymentData = array_merge($paymentData, $proofData);
            } else {
                $paymentData = $proofData;
            }

            $payment->update([
                'payment_data' => json_encode($paymentData),
                'payment_method' => $request->payment_method,
                'status' => 'pending_verification',
                'payment_status' => 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment proof submitted successfully. Awaiting verification.',
                'payment' => [
                    'id' => $payment->id,
                    'payment_status' => $payment->payment_status,
                    'status' => $payment->status,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit payment proof',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}