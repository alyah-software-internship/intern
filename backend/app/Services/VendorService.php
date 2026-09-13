<?php

namespace App\Services;

use App\Models\VendorProfile;
use App\Models\VendorPaymentMethod;
use App\Models\Product;
use App\Models\Booking;
use App\Models\User;

class VendorService
{
    /**
     * Register a user as a vendor.
     */
    public function register(int $userId, array $data): VendorProfile
    {
        return VendorProfile::updateOrCreate(
            ['user_id' => $userId],
            [
                'business_name' => $data['business_name'],
                'business_type' => $data['business_type'] ?? null,
                'description' => $data['description'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'country' => $data['country'] ?? 'Ethiopia',
                'phone' => $data['phone'] ?? null,
                'email' => $data['email'] ?? null,
                'website' => $data['website'] ?? null,
                'tax_id' => $data['tax_id'] ?? null,
                'registration_number' => $data['registration_number'] ?? null,
                'verification_status' => 'pending',
                'is_active' => true,
                'rating' => 0,
                'total_reviews' => 0,
                'total_bookings' => 0,
                'total_revenue' => 0,
                'pending_payouts' => 0,
                'security_deposit_held' => 0,
                'trust_score' => 0,
            ]
        );
    }

    /**
     * Get vendor by user ID
     */
    public function getVendorByUserId(int $userId): ?VendorProfile
    {
        return VendorProfile::where('user_id', $userId)->first();
    }

    /**
     * Check if user is a vendor
     */
    public function isVendor(int $userId): bool
    {
        return VendorProfile::where('user_id', $userId)->exists();
    }

    /**
     * Get vendor verification status
     */
    public function getVerificationStatus(int $vendorId): string
    {
        $vendor = VendorProfile::findOrFail($vendorId);
        return $vendor->verification_status;
    }

    /**
     * Get vendor by business name
     */
    public function getVendorByBusinessName(string $businessName): ?VendorProfile
    {
        return VendorProfile::where('business_name', $businessName)
            ->orWhere('business_name_am', $businessName)
            ->first();
    }

    /**
     * Update vendor verification status (Admin only)
     */
    public function updateVerificationStatus(int $vendorId, string $status, string $notes = null): VendorProfile
    {
        $vendor = VendorProfile::findOrFail($vendorId);
        $approvedAt = $status === 'approved' ? now() : null;

        $vendor->update([
            'verification_status' => $status,
            'verification_notes' => $notes,
            'verified_at' => $approvedAt,
            'verification_approved_at' => $approvedAt,
        ]);
        return $vendor->fresh();
    }

    /**
     * Get pending vendor registrations for admin.
     */
    public function getPendingVendors()
    {
        return VendorProfile::with(['user'])
            ->where('verification_status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Approve a vendor registration.
     */
    public function approveVendor(int $vendorId, ?string $notes = null): VendorProfile
    {
        $vendor = VendorProfile::findOrFail($vendorId);

        $vendor->update([
            'verification_status' => 'approved',
            'verification_notes' => $notes,
            'verified_at' => now(),
            'is_active' => true,
            'verification_approved_at' => now(),
        ]);

        return $vendor->fresh(['user']);
    }

    /**
     * Reject a vendor registration.
     */
    public function rejectVendor(int $vendorId, ?string $reason = null): VendorProfile
    {
        $vendor = VendorProfile::findOrFail($vendorId);

        $vendor->update([
            'verification_status' => 'rejected',
            'verification_notes' => $reason,
            'is_active' => false,
        ]);

        return $vendor->fresh(['user']);
    }

    /**
     * Get vendor statistics
     */
    public function getVendorStatistics(int $vendorId): array
    {
        $vendor = VendorProfile::findOrFail($vendorId);
        
        return [
            'total_products' => $vendor->products()->count(),
            'active_products' => $vendor->products()->where('status', 'active')->count(),
            'total_bookings' => $vendor->bookings()->count(),
            'pending_bookings' => $vendor->bookings()->where('status', 'pending')->count(),
            'active_bookings' => $vendor->bookings()->where('status', 'active')->count(),
            'completed_bookings' => $vendor->bookings()->where('status', 'completed')->count(),
            'cancelled_bookings' => $vendor->bookings()->where('status', 'cancelled')->count(),
            'total_revenue' => $vendor->total_revenue,
            'pending_payouts' => $vendor->pending_payouts,
            'security_deposit_held' => $vendor->security_deposit_held,
            'rating' => $vendor->rating,
            'total_reviews' => $vendor->total_reviews,
            'trust_score' => $vendor->trust_score,
        ];
    }

    /**
     * Update vendor rating
     */
    public function updateVendorRating(int $vendorId): VendorProfile
    {
        $vendor = VendorProfile::findOrFail($vendorId);
        $rating = $vendor->reviews()->avg('rating') ?? 0;
        $totalReviews = $vendor->reviews()->count();
        
        $vendor->update([
            'rating' => round($rating, 2),
            'total_reviews' => $totalReviews,
        ]);
        
        return $vendor;
    }

    /**
     * Get vendor performance metrics
     */
    public function getVendorPerformance(int $vendorId): array
    {
        $vendor = VendorProfile::findOrFail($vendorId);
        
        $totalBookings = $vendor->bookings()->count();
        $completedBookings = $vendor->bookings()->where('status', 'completed')->count();
        
        return [
            'completion_rate' => $totalBookings > 0 ? round(($completedBookings / $totalBookings) * 100, 2) : 0,
            'average_response_time' => $vendor->response_time_avg,
            'completed_projects' => $vendor->completed_projects,
            'trust_score' => $vendor->trust_score,
            'is_featured' => $vendor->is_featured,
        ];
    }

    /**
     * Get vendor payment methods (active only)
     */
    public function getActivePaymentMethods(int $vendorId): \Illuminate\Database\Eloquent\Collection
    {
        return VendorPaymentMethod::where('vendor_id', $vendorId)
            ->where('is_active', true)
            ->orderBy('is_primary', 'desc')
            ->get();
    }

    /**
     * Get vendor's primary payment method
     */
    public function getPrimaryPaymentMethod(int $vendorId): ?VendorPaymentMethod
    {
        return VendorPaymentMethod::where('vendor_id', $vendorId)
            ->where('is_primary', true)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get vendor revenue breakdown
     */
    public function getRevenueBreakdown(int $vendorId): array
    {
        $vendor = VendorProfile::findOrFail($vendorId);
        
        $bookings = $vendor->bookings()->where('status', 'completed')->get();
        
        return [
            'total_revenue' => $bookings->sum('total_amount'),
            'platform_commission' => $bookings->sum('platform_fee'),
            'net_earnings' => $bookings->sum('vendor_payment'),
            'bookings_count' => $bookings->count(),
            'average_booking_value' => $bookings->avg('total_amount') ?? 0,
            'by_month' => $bookings->groupBy(function ($booking) {
                return $booking->created_at->format('Y-m');
            })->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'revenue' => $items->sum('total_amount'),
                    'commission' => $items->sum('platform_fee'),
                    'net' => $items->sum('vendor_payment'),
                ];
            }),
        ];
    }
}