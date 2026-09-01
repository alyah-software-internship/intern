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
    protected $walletService;

    public function __construct(NotificationService $notificationService, WalletService $walletService)
    {
        $this->notificationService = $notificationService;
        $this->walletService = $walletService;
    }

    // ========== EXISTING METHODS ==========

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

            // Keep vendor earnings pending until the booking is completed and released.
            $this->walletService->addPendingEarning($vendor->user, (float) $vendorAmount, [
                'booking_id' => $booking->id,
                'payment_id' => $payment->id,
            ]);

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
    public function refundPayment(int $paymentId, ?float $amount = null, string $reason = null): Payment
    {
        return DB::transaction(function () use ($paymentId, $amount, $reason) {
            $payment = Payment::findOrFail($paymentId);

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

            // Update booking payment status
            $booking = $payment->booking;
            if ($booking) {
                $booking->update([
                    'payment_status' => 'refunded',
                ]);
            }

            // Create notification for user
            $this->notificationService->createNotification(
                $payment->user_id,
                'payment_refunded',
                'Payment Refunded',
                "Your payment of {$refundAmount} has been refunded. Reason: " . ($reason ?? 'N/A'),
                "/payments/{$payment->id}",
                'high',
                'payment'
            );

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

    // ========== NEW METHODS FOR PAYMENT CONTROLLER ==========

    /**
     * Get user payments
     */
    public function getUserPayments(int $userId): \Illuminate\Database\Eloquent\Collection
    {
        return Payment::with(['booking', 'vendor'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get payment details
     */
    public function getPaymentDetails(int $paymentId): ?Payment
    {
        return Payment::with(['booking', 'user', 'vendor'])
            ->find($paymentId);
    }

    /**
     * Get booking by ID (for PaymentController)
     */
    public function getBookingById(int $bookingId): ?Booking
    {
        return Booking::with(['product', 'vendor', 'customer'])->find($bookingId);
    }

    /**
     * Get vendor payments
     */
    public function getVendorPayments(int $vendorId): \Illuminate\Database\Eloquent\Collection
    {
        return Payment::with(['booking', 'user'])
            ->where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get user's total spent
     */
    public function getUserTotalSpent(int $userId): float
    {
        return Payment::where('user_id', $userId)
            ->where('status', 'completed')
            ->where('payment_type', 'rental')
            ->sum('amount');
    }

    /**
     * Get vendor's total earnings
     */
    public function getVendorTotalEarnings(int $vendorId): float
    {
        return VendorPayout::where('vendor_id', $vendorId)
            ->where('status', 'completed')
            ->sum('net_amount');
    }

    /**
     * Get pending payouts for vendor
     */
    public function getPendingPayouts(int $vendorId): float
    {
        return VendorPayout::where('vendor_id', $vendorId)
            ->where('status', 'pending')
            ->sum('amount');
    }

    /**
     * Get total revenue for admin dashboard.
     */
    public function getTotalRevenue(): float
    {
        return (float) Payment::where('status', 'completed')->sum('amount');
    }

    /**
     * Get total platform commission for admin dashboard.
     */
    public function getTotalCommission(): float
    {
        return (float) Booking::where('status', 'completed')->sum('platform_fee');
    }

    /**
     * Get payment statistics
     */
    public function getPaymentStats(): array
    {
        return [
            'total_payments' => Payment::count(),
            'completed_payments' => Payment::where('status', 'completed')->count(),
            'pending_payments' => Payment::where('status', 'pending')->count(),
            'failed_payments' => Payment::where('status', 'failed')->count(),
            'refunded_payments' => Payment::where('status', 'refunded')->count(),
            'total_amount' => Payment::where('status', 'completed')->sum('amount'),
            'total_refunded' => Payment::where('status', 'refunded')->sum('refund_amount'),
            'today_payments' => Payment::whereDate('created_at', today())->count(),
            'today_amount' => Payment::whereDate('created_at', today())->where('status', 'completed')->sum('amount'),
        ];
    }

    /**
     * Get payment by transaction ID
     */
    public function getPaymentByTransactionId(string $transactionId): ?Payment
    {
        return Payment::where('transaction_id', $transactionId)->first();
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(int $paymentId, string $status): Payment
    {
        $payment = Payment::findOrFail($paymentId);
        $payment->update([
            'status' => $status,
            'completed_at' => $status === 'completed' ? now() : null,
        ]);
        return $payment;
    }

    /**
     * Generate transaction ID
     */
    private function generateTransactionId(): string
    {
        return 'TXN' . date('Ymd') . strtoupper(uniqid()) . rand(1000, 9999);
    }
}