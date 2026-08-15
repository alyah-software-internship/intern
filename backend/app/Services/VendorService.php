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
     * Register vendor
     */
    public function register($userId, array $data)
    {
        // Check if user already has a vendor profile
        $existingVendor = VendorProfile::where('user_id', $userId)->first();
        if ($existingVendor) {
            throw new \Exception('User is already a vendor');
        }

        $vendor = VendorProfile::create([
            'user_id' => $userId,
            'business_name' => $data['business_name'],
            'business_name_am' => $data['business_name_am'] ?? null,
            'business_type' => $data['business_type'] ?? null,
            'business_type_am' => $data['business_type_am'] ?? null,
            'description' => $data['description'] ?? null,
            'description_am' => $data['description_am'] ?? null,
            'address' => $data['address'],
            'address_am' => $data['address_am'] ?? null,
            'city' => $data['city'],
            'city_am' => $data['city_am'] ?? null,
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'website' => $data['website'] ?? null,
            'tax_id' => $data['tax_id'] ?? null,
            'registration_number' => $data['registration_number'] ?? null,
            'verification_status' => 'pending',
            'joined_date' => now(),
        ]);

        // Update user role
        User::where('id', $userId)->update(['role' => 'vendor']);

        return $vendor;
    }

    /**
     * Get vendor dashboard data
     */
    public function getDashboard($vendorId)
    {
        $vendor = VendorProfile::with(['products', 'bookings'])->find($vendorId);
        
        return [
            'total_products' => $vendor->products()->count(),
            'active_products' => $vendor->products()->where('status', 'active')->count(),
            'total_bookings' => $vendor->bookings()->count(),
            'pending_bookings' => $vendor->bookings()->where('status', 'pending')->count(),
            'active_bookings' => $vendor->bookings()->where('status', 'active')->count(),
            'completed_bookings' => $vendor->bookings()->where('status', 'completed')->count(),
            'total_revenue' => $vendor->total_revenue,
            'pending_payouts' => $vendor->pending_payouts,
            'rating' => $vendor->rating,
            'total_reviews' => $vendor->total_reviews,
        ];
    }

    /**
     * Add payment method
     */
    public function addPaymentMethod($vendorId, array $data)
    {
        $vendor = VendorProfile::find($vendorId);
        
        // If this is the first payment method, make it primary
        $isPrimary = $vendor->paymentMethods()->count() === 0;
        
        $paymentMethod = VendorPaymentMethod::create([
            'vendor_id' => $vendorId,
            'payment_type' => $data['payment_type'],
            'account_name' => $data['account_name'],
            'account_number' => $data['account_number'],
            'bank_name' => $data['bank_name'] ?? null,
            'bank_branch' => $data['bank_branch'] ?? null,
            'swift_code' => $data['swift_code'] ?? null,
            'mobile_provider' => $data['mobile_provider'] ?? null,
            'mobile_number' => $data['mobile_number'] ?? null,
            'paypal_email' => $data['paypal_email'] ?? null,
            'is_primary' => $isPrimary,
            'verification_status' => 'pending',
        ]);

        return $paymentMethod;
    }

    /**
     * Get vendor payment methods
     */
    public function getPaymentMethods($vendorId)
    {
        return VendorPaymentMethod::where('vendor_id', $vendorId)
            ->where('is_active', true)
            ->orderBy('is_primary', 'desc')
            ->get();
    }

    /**
     * Set primary payment method
     */
    public function setPrimaryPaymentMethod($vendorId, $methodId)
    {
        // Reset all primary flags
        VendorPaymentMethod::where('vendor_id', $vendorId)->update(['is_primary' => false]);
        
        // Set the selected method as primary
        $method = VendorPaymentMethod::where('vendor_id', $vendorId)
            ->where('id', $methodId)
            ->first();
            
        if ($method) {
            $method->update(['is_primary' => true]);
            return $method;
        }
        
        return null;
    }

    /**
     * Get vendor bookings
     */
    public function getBookings($vendorId, $status = null)
    {
        $query = Booking::where('vendor_id', $vendorId)
            ->with(['product', 'customer', 'operator'])
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        return $query->get();
    }

    /**
     * Get vendor revenue stats
     */
    public function getRevenueStats($vendorId, $period = 'monthly')
    {
        $vendor = VendorProfile::find($vendorId);
        
        $query = Booking::where('vendor_id', $vendorId)
            ->where('status', 'completed');

        // Apply period filter
        switch ($period) {
            case 'daily':
                $query->whereDate('completed_at', today());
                break;
            case 'weekly':
                $query->whereBetween('completed_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'monthly':
                $query->whereMonth('completed_at', now()->month);
                break;
            case 'yearly':
                $query->whereYear('completed_at', now()->year);
                break;
        }

        $bookings = $query->get();

        return [
            'total_revenue' => $bookings->sum('total_amount'),
            'platform_commission' => $bookings->sum('platform_commission'),
            'net_revenue' => $bookings->sum('vendor_payment'),
            'total_bookings' => $bookings->count(),
            'average_booking_value' => $bookings->avg('total_amount') ?? 0,
        ];
    }

    /**
     * Update vendor profile
     */
    public function updateProfile($vendorId, array $data)
    {
        $vendor = VendorProfile::find($vendorId);
        $vendor->update($data);
        return $vendor;
    }
}