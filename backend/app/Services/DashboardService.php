<?php

namespace App\Services;

use App\Models\User;
use App\Models\VendorProfile;
use App\Models\Product;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Get admin dashboard data
     */
    public function getAdminDashboard(): array
    {
        return [
            'total_users' => User::count(),
            'total_vendors' => User::where('role', 'vendor')->count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_products' => Product::count(),
            'active_products' => Product::where('status', 'active')->count(),
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'platform_commission' => Booking::sum('platform_fee'),
            'recent_bookings' => Booking::with(['customer', 'product'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
            'recent_users' => User::orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
        ];
    }

    /**
     * Get vendor dashboard data
     */
    public function getVendorDashboard(int $vendorId): array
    {
        $vendor = VendorProfile::find($vendorId);
        
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
            'recent_bookings' => $vendor->bookings()
                ->with(['product', 'customer'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
            'monthly_revenue' => $this->getMonthlyRevenue($vendorId),
        ];
    }

    /**
     * Get customer dashboard data
     */
    public function getCustomerDashboard(int $userId): array
    {
        $user = User::find($userId);
        
        return [
            'total_bookings' => $user->bookings()->count(),
            'active_bookings' => $user->bookings()->where('status', 'active')->count(),
            'completed_bookings' => $user->bookings()->where('status', 'completed')->count(),
            'total_spent' => $user->total_spent,
            'trust_score' => $user->trust_score,
            'wishlist_count' => $user->wishlist()->count(),
            'recent_bookings' => $user->bookings()
                ->with(['product', 'vendor'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get(),
            'unread_notifications' => $user->notifications()->where('is_read', false)->count(),
        ];
    }

    /**
     * Get monthly revenue for vendor
     */
    private function getMonthlyRevenue(int $vendorId): array
    {
        $monthlyData = DB::table('bookings')
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as revenue')
            )
            ->where('vendor_id', $vendorId)
            ->where('status', 'completed')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        return $monthlyData->map(function ($item) {
            return [
                'month' => date('F', mktime(0, 0, 0, $item->month, 1)),
                'year' => $item->year,
                'revenue' => $item->revenue,
            ];
        })->toArray();
    }
}