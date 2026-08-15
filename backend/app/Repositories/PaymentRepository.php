<?php

namespace App\Repositories;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Collection;

class PaymentRepository extends BaseRepository
{
    public function __construct(Payment $model)
    {
        parent::__construct($model);
    }

    /**
     * Get payments by booking
     */
    public function findByBooking(int $bookingId): Collection
    {
        return $this->model->where('booking_id', $bookingId)->get();
    }

    /**
     * Get payments by user
     */
    public function findByUser(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get payments by vendor
     */
    public function findByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get completed payments
     */
    public function getCompletedPayments(): Collection
    {
        return $this->model->where('status', 'completed')->get();
    }

    /**
     * Get pending payments
     */
    public function getPendingPayments(): Collection
    {
        return $this->model->where('status', 'pending')->get();
    }

    /**
     * Get payments by transaction ID
     */
    public function findByTransactionId(string $transactionId): ?Payment
    {
        return $this->model->where('transaction_id', $transactionId)->first();
    }

    /**
     * Update payment status
     */
    public function updateStatus(int $paymentId, string $status): Payment
    {
        $payment = $this->findOrFail($paymentId);
        $payment->update(['status' => $status]);
        return $payment;
    }
}