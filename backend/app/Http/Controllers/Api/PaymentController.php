<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use App\Services\BookingService;
use App\Services\NotificationService;
use App\Models\Payment;
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
            'payment_method' => 'required|in:credit_card,paypal,apple_pay,bank_transfer,cbe,telebirr',
            'payment_data' => 'nullable|array',
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

            $paymentData = [
                'payment_method' => $request->payment_method,
                'payment_data' => $request->payment_data,
            ];

            $result = $this->paymentService->processBookingPayment($booking, $paymentData);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'payment' => $result['payment'],
                'booking' => $result['booking'],
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
}