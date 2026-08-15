<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Booking;
use App\Models\SecurityDeposit;
use App\Models\VendorProfile;
use App\Models\VendorPayout;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Process booking payment
     */
    public function processBookingPayment(Booking $booking, array $paymentData): array
    {
        return DB::transaction(function () use ($booking, $paymentData) {
            // Check if booking is already paid
            if ($booking->payment_status === 'paid') {
                throw new \Exception('Booking is already paid');
            }

            // Calculate amounts
            $totalAmount = $booking->total_amount;
            $vendorAmount = $booking->vendor_payment;
            $platformFee = $booking->platform_fee;
            $securityDeposit = $booking->security_deposit_amount;

            // Create payment record for rental
            $payment = Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $booking->customer_id,
                'vendor_id' => $booking->vendor_id,
                'amount' => $totalAmount,
                'payment_type' => 'rental',
                'payment_method' => $paymentData['payment_method'],
                'transaction_id' => $this->generateTransactionId(),
                'payment_data' => $paymentData['payment_data'] ?? null,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Process security deposit if exists
            if ($securityDeposit > 0) {
                $this->processSecurityDeposit($booking, $paymentData);
            }

            // Create platform fee payment
            if ($platformFee > 0) {
                Payment::create([
                    'booking_id' => $booking->id,
                    'user_id' => $booking->customer_id,
                    'vendor_id' => null,
                    'amount' => $platformFee,
                    'payment_type' => 'platform_fee',
                    'payment_method' => $paymentData['payment_method'],
                    'transaction_id' => $this->generateTransactionId(),
                    'payment_data' => $paymentData['payment_data'] ?? null,
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
            }

            // Create operator payment if operator exists
            if ($booking->operator_id && $booking->operator_charge > 0) {
                Payment::create([
                    'booking_id' => $booking->id,
                    'user_id' => $booking->customer_id,
                    'vendor_id' => $booking->vendor_id,
                    'amount' => $booking->operator_charge,
                    'payment_type' => 'operator',
                    'payment_method' => $paymentData['payment_method'],
                    'transaction_id' => $this->generateTransactionId(),
                    'payment_data' => $paymentData['payment_data'] ?? null,
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);
            }

            // Update booking status
            $booking->update([
                'payment_status' => 'paid',
                'status' => 'confirmed',
                'payment_method' => $paymentData['payment_method'],
                'transaction_id' => $payment->transaction_id,
            ]);

            // Update vendor profile
            $vendor = VendorProfile::find($booking->vendor_id);
            $vendor->increment('total_bookings');
            $vendor->increment('pending_payouts', $vendorAmount);

            // Create vendor payout record
            $this->createVendorPayout($booking, $vendorAmount);

            // Send notifications
            $this->notificationService->paymentReceived(
                $booking->customer_id,
                [
                    'amount' => $totalAmount,
                    'reference' => $booking->booking_reference,
                    'link' => "/customer/bookings/{$booking->id}",
                ]
            );

            return [
                'payment' => $payment,
                'booking' => $booking,
            ];
        });
    }

    /**
     * Process security deposit
     */
    public function processSecurityDeposit(Booking $booking, array $paymentData): SecurityDeposit
    {
        return DB::transaction(function () use ($booking, $paymentData) {
            $securityDeposit = SecurityDeposit::where('booking_id', $booking->id)->first();

            if (!$securityDeposit) {
                $securityDeposit = SecurityDeposit::create([
                    'booking_id' => $booking->id,
                    'customer_id' => $booking->customer_id,
                    'vendor_id' => $booking->vendor_id,
                    'amount' => $booking->security_deposit_amount,
                    'status' => 'pending',
                ]);
            }

            // Create payment for security deposit
            Payment::create([
                'booking_id' => $booking->id,
                'user_id' => $booking->customer_id,
                'vendor_id' => $booking->vendor_id,
                'amount' => $booking->security_deposit_amount,
                'payment_type' => 'security_deposit',
                'payment_method' => $paymentData['payment_method'],
                'transaction_id' => $this->generateTransactionId(),
                'payment_data' => $paymentData['payment_data'] ?? null,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            $securityDeposit->update([
                'status' => 'held',
                'held_at' => now(),
                'payment_transaction_id' => $this->generateTransactionId(),
            ]);

            // Update vendor security deposit held
            $vendor = VendorProfile::find($booking->vendor_id);
            $vendor->increment('security_deposit_held', $booking->security_deposit_amount);

            return $securityDeposit;
        });
    }

    /**
     * Release security deposit
     */
    public function releaseSecurityDeposit(Booking $booking, ?float $deductAmount = null, ?string $reason = null): SecurityDeposit
    {
        return DB::transaction(function () use ($booking, $deductAmount, $reason) {
            $securityDeposit = SecurityDeposit::where('booking_id', $booking->id)
                ->where('status', 'held')
                ->first();

            if (!$securityDeposit) {
                throw new \Exception('Security deposit not found or not held');
            }

            $refundAmount = $securityDeposit->amount - ($deductAmount ?? 0);

            if ($deductAmount > 0 && $deductAmount < $securityDeposit->amount) {
                // Partial refund (deduction)
                $securityDeposit->update([
                    'status' => 'deducted',
                    'deducted_amount' => $deductAmount,
                    'deduction_reason' => $reason,
                    'refunded_at' => now(),
                ]);

                // Create refund payment
                Payment::create([
                    'booking_id' => $booking->id,
                    'user_id' => $booking->customer_id,
                    'vendor_id' => $booking->vendor_id,
                    'amount' => $refundAmount,
                    'payment_type' => 'refund',
                    'payment_method' => 'security_deposit',
                    'transaction_id' => $this->generateTransactionId(),
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);

                $this->notificationService->depositDeducted(
                    $booking->customer_id,
                    [
                        'reference' => $booking->booking_reference,
                        'deducted_amount' => $deductAmount,
                        'link' => "/customer/bookings/{$booking->id}",
                    ]
                );

            } else {
                // Full refund
                $securityDeposit->update([
                    'status' => 'released',
                    'released_at' => now(),
                ]);

                // Create refund payment
                Payment::create([
                    'booking_id' => $booking->id,
                    'user_id' => $booking->customer_id,
                    'vendor_id' => $booking->vendor_id,
                    'amount' => $refundAmount,
                    'payment_type' => 'refund',
                    'payment_method' => 'security_deposit',
                    'transaction_id' => $this->generateTransactionId(),
                    'status' => 'completed',
                    'completed_at' => now(),
                ]);

                $this->notificationService->depositReleased(
                    $booking->customer_id,
                    [
                        'reference' => $booking->booking_reference,
                        'amount' => $refundAmount,
                        'link' => "/customer/bookings/{$booking->id}",
                    ]
                );
            }

            // Update booking
            $booking->update([
                'security_deposit_status' => $deductAmount > 0 ? 'deducted' : 'released',
            ]);

            // Update vendor security deposit held
            $vendor = VendorProfile::find($booking->vendor_id);
            $vendor->decrement('security_deposit_held', $securityDeposit->amount);

            return $securityDeposit;
        });
    }

    /**
     * Create vendor payout
     */
    public function createVendorPayout(Booking $booking, float $amount): VendorPayout
    {
        $vendor = VendorProfile::find($booking->vendor_id);
        $primaryMethod = $vendor->paymentMethods()->where('is_primary', true)->first();

        if (!$primaryMethod) {
            Log::warning("Vendor {$vendor->id} has no primary payment method");
            // You might want to handle this differently
        }

        return VendorPayout::create([
            'vendor_id' => $booking->vendor_id,
            'payment_method_id' => $primaryMethod?->id,
            'booking_id' => $booking->id,
            'amount' => $amount,
            'platform_commission' => $booking->platform_fee,
            'net_amount' => $amount - $booking->platform_fee,
            'status' => 'pending',
            'notes' => "Payout for booking #{$booking->booking_reference}",
        ]);
    }

    /**
     * Process vendor payout
     */
    public function processVendorPayout(int $payoutId, array $data): VendorPayout
    {
        $payout = VendorPayout::findOrFail($payoutId);

        if ($payout->status !== 'pending') {
            throw new \Exception('Payout is not in pending status');
        }

        $payout->update([
            'status' => 'processing',
            'processed_by' => $data['processed_by'] ?? null,
            'processed_at' => now(),
        ]);

        // Here you would integrate with payment gateway to send money

        $payout->update([
            'status' => 'completed',
            'transaction_id' => $data['transaction_id'] ?? $this->generateTransactionId(),
            'completed_at' => now(),
        ]);

        // Update vendor pending payouts
        $vendor = VendorProfile::find($payout->vendor_id);
        $vendor->decrement('pending_payouts', $payout->amount);

        return $payout;
    }

    /**
     * Refund payment
     */
    public function refundPayment(Payment $payment, ?float $amount = null): Payment
    {
        return DB::transaction(function () use ($payment, $amount) {
            if ($payment->status !== 'completed') {
                throw new \Exception('Payment cannot be refunded');
            }

            $refundAmount = $amount ?? $payment->amount;

            // Process refund via payment gateway
            // $this->refundViaGateway($payment, $refundAmount);

            $payment->update([
                'status' => 'refunded',
                'refund_amount' => $refundAmount,
                'refund_transaction_id' => $this->generateTransactionId(),
            ]);

            return $payment;
        });
    }

    /**
     * Get payment summary for vendor
     */
    public function getVendorPaymentSummary(int $vendorId): array
    {
        $vendor = VendorProfile::find($vendorId);

        $completedPayments = Payment::where('vendor_id', $vendorId)
            ->where('status', 'completed')
            ->sum('amount');

        $pendingPayouts = VendorPayout::where('vendor_id', $vendorId)
            ->where('status', 'pending')
            ->sum('amount');

        $totalEarnings = VendorPayout::where('vendor_id', $vendorId)
            ->where('status', 'completed')
            ->sum('net_amount');

        $securityHeld = SecurityDeposit::where('vendor_id', $vendorId)
            ->where('status', 'held')
            ->sum('amount');

        return [
            'total_revenue' => $completedPayments,
            'pending_payouts' => $pendingPayouts,
            'total_earnings' => $totalEarnings,
            'security_deposit_held' => $securityHeld,
            'available_balance' => $totalEarnings - $pendingPayouts,
        ];
    }

    /**
     * Generate transaction ID
     */
    private function generateTransactionId(): string
    {
        return 'TXN' . date('Ymd') . strtoupper(uniqid()) . rand(1000, 9999);
    }

    /**
     * Payment gateway integration (placeholder)
     */
    public function processWithPaymentGateway(array $paymentData): array
    {
        // Integrate with your payment gateway (Stripe, Chapa, Telebirr, etc.)
        // Example: Stripe, Chapa, Telebirr integration

        return [
            'success' => true,
            'transaction_id' => $this->generateTransactionId(),
            'status' => 'completed',
            'message' => 'Payment processed successfully',
        ];
    }

    /**
     * Webhook handler for payment gateway
     */
    public function handleWebhook(array $payload): void
    {
        // Handle payment gateway webhook events
        Log::info('Payment webhook received', $payload);
    }
}