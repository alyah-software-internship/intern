<?php

namespace App\Repositories;

use App\Models\Booking;
use Illuminate\Database\Eloquent\Collection;

class BookingRepository extends BaseRepository
{
    public function __construct(Booking $model)
    {
        parent::__construct($model);
    }

    /**
     * Get bookings by customer
     */
    public function findByCustomer(int $customerId): Collection
    {
        return $this->model->where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get bookings by vendor
     */
    public function findByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get bookings by product
     */
    public function findByProduct(int $productId): Collection
    {
        return $this->model->where('product_id', $productId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get bookings by status
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model->where('status', $status)->get();
    }

    /**
     * Get active bookings
     */
    public function getActiveBookings(): Collection
    {
        return $this->model->where('status', 'active')->get();
    }

    /**
     * Get pending bookings
     */
    public function getPendingBookings(): Collection
    {
        return $this->model->where('status', 'pending')->get();
    }

    /**
     * Get booking by reference
     */
    public function findByReference(string $reference): ?Booking
    {
        return $this->model->where('booking_reference', $reference)->first();
    }

    /**
     * Update booking status
     */
    public function updateStatus(int $bookingId, string $status): Booking
    {
        $booking = $this->findOrFail($bookingId);
        $booking->update(['status' => $status]);
        return $booking;
    }

    /**
     * Update payment status
     */
    public function updatePaymentStatus(int $bookingId, string $status): Booking
    {
        $booking = $this->findOrFail($bookingId);
        $booking->update(['payment_status' => $status]);
        return $booking;
    }
}