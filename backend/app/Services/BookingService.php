<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Product;
use App\Models\SecurityDeposit;
use App\Models\Notification;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class BookingService
{
    /**
     * Get bookings for a user.
     */
    public function getUserBookings($userId, $status = null)
    {
        $query = Booking::with(['product', 'vendor', 'customer'])
            ->where('customer_id', $userId);

        if ($status !== null && $status !== '') {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get booking details for a specific user.
     */
    public function getBookingDetails($bookingId, $userId)
    {
        return Booking::with(['product', 'vendor', 'customer', 'operator', 'securityDeposit'])
            ->where('id', $bookingId)
            ->where('customer_id', $userId)
            ->first();
    }

    /**
     * Get booking by ID.
     */
    public function getBookingById(int $bookingId): ?Booking
    {
        return Booking::with(['product', 'vendor', 'customer', 'operator', 'securityDeposit'])
            ->find($bookingId);
    }

    /**
     * Get bookings for a vendor.
     */
    public function getVendorBookings($vendorId, $status = null)
    {
        $query = Booking::with(['product', 'customer', 'vendor', 'operator'])
            ->where('vendor_id', $vendorId);

        if ($status !== null && $status !== '') {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get all bookings for admin dashboard.
     */
    public function getAllBookings()
    {
        return Booking::with(['product', 'customer', 'vendor'])->orderBy('created_at', 'desc');
    }

    /**
     * Get pending bookings for admin dashboard.
     */
    public function getPendingBookings()
    {
        return Booking::with(['product', 'customer', 'vendor'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Create booking
     */
    public function createBooking(array $data)
    {
        return DB::transaction(function () use ($data) {
            $product = Product::find($data['product_id']);
            
            // Check availability
            if (!$this->isProductAvailable($product, $data['start_date'], $data['end_date'])) {
                throw new \Exception('Product is not available for the selected dates');
            }

            // Calculate amounts
            $days = (int) ceil($data['start_date']->diffInDays($data['end_date']));
            $rentalAmount = $product->price_daily * $days;
            $securityDeposit = $this->calculateSecurityDeposit($product, $rentalAmount);
            $platformFee = $this->calculatePlatformFee($rentalAmount);
            $operatorCharge = $this->calculateOperatorCharge($data, $days);
            
            $totalAmount = $rentalAmount + $securityDeposit + $platformFee + $operatorCharge;

            // Generate reference
            $reference = $this->generateBookingReference();

            // Create booking
            $booking = Booking::create([
                'booking_reference' => $reference,
                'product_id' => $data['product_id'],
                'customer_id' => $data['customer_id'],
                'vendor_id' => $product->vendor_id,
                'operator_id' => $data['operator_id'] ?? null,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'],
                'rental_days' => $days,
                'pricing_model' => $product->pricing_model,
                'rental_amount' => $rentalAmount,
                'operator_charge' => $operatorCharge,
                'security_deposit_amount' => $securityDeposit,
                'delivery_charge' => $data['delivery_charge'] ?? 0,
                'platform_fee' => $platformFee,
                'total_amount' => $totalAmount,
                'vendor_payment' => $rentalAmount - $platformFee + $operatorCharge,
                'platform_commission' => $platformFee,
                'delivery_address' => $data['delivery_address'] ?? null,
                'special_requests' => $data['special_requests'] ?? null,
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            // Create security deposit record
            if ($securityDeposit > 0) {
                SecurityDeposit::create([
                    'booking_id' => $booking->id,
                    'customer_id' => $data['customer_id'],
                    'vendor_id' => $product->vendor_id,
                    'amount' => $securityDeposit,
                    'status' => 'pending',
                ]);
            }

            // Create notification for vendor
            $this->createNotification(
                $product->vendor->user_id,
                'New Booking Request',
                "You have a new booking request for {$product->name}.",
                'booking'
            );

            return $booking;
        });
    }

    /**
     * Check product availability
     */
    public function isProductAvailable($product, $startDate, $endDate)
    {
        if (!$product || $product->status !== 'active' || $product->availability_status !== 'available') {
            return false;
        }

        // Check for overlapping bookings
        $overlapping = Booking::where('product_id', $product->id)
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'rejected')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function ($q) use ($startDate, $endDate) {
                          $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                      });
            })
            ->exists();

        return !$overlapping;
    }

    /**
     * Calculate security deposit
     */
    private function calculateSecurityDeposit($product, $rentalAmount)
    {
        if ($product->security_deposit_type === 'percentage') {
            return ($rentalAmount * $product->security_deposit_percentage) / 100;
        }
        return $product->security_deposit_amount ?? 0;
    }

    /**
     * Calculate platform fee
     */
    private function calculatePlatformFee($amount)
    {
        $commission = \App\Models\PlatformCommissionSetting::where('is_active', true)->first();
        if (!$commission) {
            return $amount * 0.10; // Default 10%
        }

        if ($commission->commission_type === 'percentage') {
            return ($amount * $commission->commission_value) / 100;
        }
        return $commission->commission_value;
    }

    /**
     * Calculate operator charge
     */
    private function calculateOperatorCharge($data, $days)
    {
        if (empty($data['operator_id'])) {
            return 0;
        }

        $operator = \App\Models\Operator::find($data['operator_id']);
        if (!$operator) {
            return 0;
        }

        return $operator->daily_rate * $days;
    }

    /**
     * Generate booking reference
     */
    private function generateBookingReference()
    {
        $prefix = 'BK';
        $date = date('Ymd');
        $random = strtoupper(Str::random(6));
        
        $reference = $prefix . $date . $random;
        
        // Ensure uniqueness
        while (Booking::where('booking_reference', $reference)->exists()) {
            $random = strtoupper(Str::random(6));
            $reference = $prefix . $date . $random;
        }
        
        return $reference;
    }

    /**
     * Approve booking
     */
    public function approveBooking($bookingId, $vendorId)
    {
        $booking = Booking::where('id', $bookingId)
            ->where('vendor_id', $vendorId)
            ->where('status', 'pending')
            ->first();

        if (!$booking) {
            throw new \Exception('Booking not found or not pending');
        }

        $booking->update([
            'status' => 'confirmed',
            'operator_status' => $booking->operator_id ? 'assigned' : 'pending',
        ]);

        // Notify customer
        $this->createNotification(
            $booking->customer_id,
            'Booking Confirmed',
            "Your booking {$booking->booking_reference} has been confirmed.",
            'booking'
        );

        return $booking;
    }

    /**
     * Reject booking
     */
    public function rejectBooking($bookingId, $vendorId, $reason = null)
    {
        $booking = Booking::where('id', $bookingId)
            ->where('vendor_id', $vendorId)
            ->where('status', 'pending')
            ->first();

        if (!$booking) {
            throw new \Exception('Booking not found or not pending');
        }

        $booking->update([
            'status' => 'rejected',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);

        // Notify customer
        $this->createNotification(
            $booking->customer_id,
            'Booking Rejected',
            "Your booking {$booking->booking_reference} has been rejected.",
            'booking'
        );

        return $booking;
    }

    /**
     * Cancel booking
     */
    public function cancelBooking($bookingId, $userId, $reason = null)
    {
        $booking = Booking::where('id', $bookingId)
            ->where('customer_id', $userId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->first();

        if (!$booking) {
            throw new \Exception('Booking not found or cannot be cancelled');
        }

        $booking->update([
            'status' => 'cancelled',
            'cancellation_reason' => $reason,
            'cancelled_at' => now(),
        ]);

        // Release security deposit if held
        if ($booking->securityDeposit && $booking->securityDeposit->status === 'held') {
            $booking->securityDeposit->update(['status' => 'released']);
        }

        // Notify vendor
        $this->createNotification(
            $booking->vendor->user_id,
            'Booking Cancelled',
            "Booking {$booking->booking_reference} has been cancelled by the customer.",
            'booking'
        );

        return $booking;
    }

    /**
     * Complete booking
     */
    public function completeBooking($bookingId, $vendorId)
    {
        $booking = Booking::where('id', $bookingId)
            ->where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->first();

        if (!$booking) {
            throw new \Exception('Booking not found or not active');
        }

        $booking->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Update vendor stats
        $vendor = $booking->vendor;
        $vendor->increment('total_bookings');
        $vendor->increment('completed_projects');
        $vendor->update([
            'total_revenue' => $vendor->total_revenue + $booking->vendor_payment,
        ]);

        // Update product availability
        $product = $booking->product;
        $product->update(['availability_status' => 'available']);

        return $booking;
    }

    /**
     * Create notification
     */
    private function createNotification($userId, $title, $message, $type = 'system')
    {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'is_read' => false,
        ]);
    }
}