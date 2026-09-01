<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PaymentWebhookController extends Controller
{
    protected $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Handle payment provider webhook
     * This endpoint should NOT require authentication as it's called by payment provider
     */
    public function handleWebhook(Request $request)
    {
        try {
            $provider = $request->input('provider', 'mock');
            
            // Get payment provider
            $paymentProvider = \App\Services\PaymentProviders\PaymentProviderFactory::make($provider);

            // Validate webhook signature
            $signature = $request->header('X-Webhook-Signature') ?? $request->input('signature');
            $payload = $request->getContent();

            if (!$paymentProvider->validateWebhookSignature($payload, $signature)) {
                Log::warning('Invalid webhook signature', [
                    'provider' => $provider,
                    'ip' => $request->ip(),
                ]);

                return response()->json([
                    'success' => false,
                    'message' => 'Invalid signature'
                ], 401);
            }

            // Parse webhook payload
            $webhookData = $paymentProvider->parseWebhookPayload($payload);

            // Handle webhook based on event type
            $eventType = $webhookData['event_type'] ?? null;

            if ($eventType === 'payment.completed' || $eventType === 'payment.success') {
                return $this->handlePaymentSuccess($webhookData);
            } elseif ($eventType === 'payment.failed') {
                return $this->handlePaymentFailed($webhookData);
            } elseif ($eventType === 'refund.completed') {
                return $this->handleRefundCompleted($webhookData);
            } else {
                Log::info('Unhandled webhook event', [
                    'event_type' => $eventType,
                    'provider' => $provider,
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Event received but not processed'
                ]);
            }

        } catch (\Exception $e) {
            Log::error('Webhook handling error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Webhook processing failed'
            ], 500);
        }
    }

    /**
     * Handle successful payment
     */
    protected function handlePaymentSuccess(array $webhookData)
    {
        try {
            $result = $this->paymentService->handlePaymentWebhook($webhookData);

            if ($result['success']) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payment processed successfully',
                    'payment_id' => $result['payment_id'] ?? null,
                ]);
            } else {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Payment processing failed',
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error('Payment success handler error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment success'
            ], 500);
        }
    }

    /**
     * Handle failed payment
     */
    protected function handlePaymentFailed(array $webhookData)
    {
        try {
            $providerReference = $webhookData['provider_reference'] ?? null;
            $reference = $webhookData['reference'] ?? null;

            $payment = Payment::where('provider_reference', $providerReference)->first();

            if ($payment) {
                $payment->update([
                    'status' => 'failed',
                    'payment_status' => 'failed',
                    'failed_at' => now(),
                    'webhook_verified' => true,
                    'webhook_verified_at' => now(),
                ]);

                // Update booking status
                $booking = $payment->booking;
                if ($booking) {
                    $booking->update([
                        'payment_status' => 'failed',
                        'status' => 'pending',
                    ]);
                }

                Log::info('Payment failed via webhook', [
                    'payment_id' => $payment->id,
                    'provider_reference' => $providerReference,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment failure recorded'
            ]);

        } catch (\Exception $e) {
            Log::error('Payment failure handler error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process payment failure'
            ], 500);
        }
    }

    /**
     * Handle refund completion
     */
    protected function handleRefundCompleted(array $webhookData)
    {
        try {
            $paymentProviderReference = $webhookData['original_transaction_id'] ?? null;
            $refundReference = $webhookData['refund_reference'] ?? null;

            $payment = Payment::where('provider_reference', $paymentProviderReference)->first();

            if ($payment) {
                $refund = Refund::where('payment_id', $payment->id)
                    ->where('status', 'processing')
                    ->first();

                if ($refund) {
                    $refund->update([
                        'status' => 'completed',
                        'provider_reference' => $refundReference,
                        'processed_at' => now(),
                    ]);

                    Log::info('Refund completed via webhook', [
                        'refund_id' => $refund->id,
                        'payment_id' => $payment->id,
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Refund completion recorded'
            ]);

        } catch (\Exception $e) {
            Log::error('Refund completion handler error', [
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to process refund completion'
            ], 500);
        }
    }

    /**
     * Initiate payment for a booking
     * POST /api/payments/initiate
     */
    public function initiatePayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'provider' => 'nullable|string|in:mock,stripe,chapa,telebirr',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = Booking::find($request->booking_id);

            // Authorization check
            if ($booking->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            // Check booking status
            if ($booking->status !== 'confirmed' || $booking->payment_status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking is not ready for payment'
                ], 400);
            }

            $provider = $request->input('provider', config('services.payment.default', 'mock'));
            $result = $this->paymentService->initiatePaymentViaProvider($booking, $provider);

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'] ?? 'Payment initiated',
                'payment_id' => $result['payment_id'] ?? null,
                'payment_url' => $result['payment_url'] ?? null,
                'provider_reference' => $result['provider_reference'] ?? null,
            ], $result['success'] ? 200 : 400);

        } catch (\Exception $e) {
            Log::error('Payment initiation error', [
                'error' => $e->getMessage(),
                'booking_id' => $request->booking_id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to initiate payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify payment status
     * GET /api/payments/verify/:paymentId
     */
    public function verifyPayment(Request $request, $paymentId)
    {
        try {
            $payment = Payment::find($paymentId);

            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment not found'
                ], 404);
            }

            // Authorization check
            if ($payment->user_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 403);
            }

            return response()->json([
                'success' => true,
                'payment' => [
                    'id' => $payment->id,
                    'booking_id' => $payment->booking_id,
                    'amount' => $payment->amount,
                    'status' => $payment->status,
                    'payment_status' => $payment->payment_status,
                    'provider_reference' => $payment->provider_reference,
                    'paid_at' => $payment->paid_at,
                    'webhook_verified' => $payment->webhook_verified,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Payment verification error', [
                'error' => $e->getMessage(),
                'payment_id' => $paymentId,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to verify payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
