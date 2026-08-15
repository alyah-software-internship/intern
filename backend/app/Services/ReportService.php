<?php

namespace App\Services;

use App\Models\User;
use App\Models\VendorProfile;
use App\Models\Product;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Generate user report
     */
    public function generateUserReport(array $filters = []): array
    {
        $query = User::query();

        if (isset($filters['role'])) {
            $query->where('role', $filters['role']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $users = $query->get();

        return [
            'total_users' => $users->count(),
            'by_role' => $users->groupBy('role')->map->count(),
            'by_month' => $users->groupBy(function ($user) {
                return $user->created_at->format('Y-m');
            })->map->count(),
            'active_users' => $users->where('is_active', true)->count(),
            'verified_users' => $users->whereNotNull('email_verified_at')->count(),
            'users' => $users,
        ];
    }

    /**
     * Generate revenue report
     */
    public function generateRevenueReport(array $filters = []): array
    {
        $query = Booking::where('status', 'completed');

        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $bookings = $query->get();

        return [
            'total_revenue' => $bookings->sum('total_amount'),
            'total_commission' => $bookings->sum('platform_fee'),
            'net_revenue' => $bookings->sum('vendor_payment'),
            'total_bookings' => $bookings->count(),
            'average_booking_value' => $bookings->avg('total_amount') ?? 0,
            'by_vendor' => $bookings->groupBy('vendor_id')->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'revenue' => $items->sum('total_amount'),
                    'commission' => $items->sum('platform_fee'),
                ];
            }),
            'by_month' => $bookings->groupBy(function ($booking) {
                return $booking->created_at->format('Y-m');
            })->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'revenue' => $items->sum('total_amount'),
                    'commission' => $items->sum('platform_fee'),
                ];
            }),
            'bookings' => $bookings,
        ];
    }

    /**
     * Generate product report
     */
    public function generateProductReport(array $filters = []): array
    {
        $query = Product::with(['vendor', 'category']);

        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $products = $query->get();

        return [
            'total_products' => $products->count(),
            'active_products' => $products->where('status', 'active')->count(),
            'inactive_products' => $products->where('status', 'inactive')->count(),
            'by_category' => $products->groupBy('category.name')->map->count(),
            'by_vendor' => $products->groupBy('vendor.business_name')->map->count(),
            'most_viewed' => $products->sortByDesc('views_count')->take(10),
            'highest_rated' => $products->sortByDesc('rating')->take(10),
            'products' => $products,
        ];
    }

    /**
     * Generate vendor performance report
     */
    public function generateVendorReport(array $filters = []): array
    {
        $query = VendorProfile::with(['user', 'products', 'bookings']);

        if (isset($filters['verification_status'])) {
            $query->where('verification_status', $filters['verification_status']);
        }

        if (isset($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        $vendors = $query->get();

        return [
            'total_vendors' => $vendors->count(),
            'verified_vendors' => $vendors->where('verification_status', 'approved')->count(),
            'pending_vendors' => $vendors->where('verification_status', 'pending')->count(),
            'by_verification_status' => $vendors->groupBy('verification_status')->map->count(),
            'top_performers' => $vendors->sortByDesc('total_revenue')->take(10),
            'highest_rated' => $vendors->sortByDesc('rating')->take(10),
            'vendors' => $vendors,
        ];
    }

    /**
     * Get booking report
     */
    public function getBookingReport(array $filters = []): array
    {
        $query = Booking::with(['product', 'customer', 'vendor']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (isset($filters['customer_id'])) {
            $query->where('customer_id', $filters['customer_id']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $bookings = $query->get();

        return [
            'total_bookings' => $bookings->count(),
            'by_status' => $bookings->groupBy('status')->map->count(),
            'total_revenue' => $bookings->sum('total_amount'),
            'total_commission' => $bookings->sum('platform_fee'),
            'average_booking_value' => $bookings->avg('total_amount') ?? 0,
            'by_month' => $bookings->groupBy(function ($booking) {
                return $booking->created_at->format('Y-m');
            })->map->count(),
            'bookings' => $bookings,
        ];
    }

    /**
     * Get payment report
     */
    public function getPaymentReport(array $filters = []): array
    {
        $query = Payment::with(['booking', 'user', 'vendor']);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['payment_type'])) {
            $query->where('payment_type', $filters['payment_type']);
        }

        if (isset($filters['date_from'])) {
            $query->where('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->where('created_at', '<=', $filters['date_to']);
        }

        $payments = $query->get();

        return [
            'total_payments' => $payments->count(),
            'total_amount' => $payments->sum('amount'),
            'by_status' => $payments->groupBy('status')->map->count(),
            'by_type' => $payments->groupBy('payment_type')->map->count(),
            'by_month' => $payments->groupBy(function ($payment) {
                return $payment->created_at->format('Y-m');
            })->map->count(),
            'payments' => $payments,
        ];
    }
}