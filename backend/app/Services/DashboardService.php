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
            'active_bookings' => Booking::where('status', 'active')->count(),
            'completed_bookings' => Booking::where('status', 'completed')->count(),
            'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
            'platform_commission' => Booking::sum('platform_fee'),
            'total_payouts' => \App\Models\VendorPayout::where('status', 'completed')->sum('net_amount'),
            'pending_payouts' => \App\Models\VendorPayout::where('status', 'pending')->sum('amount'),
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
     * Get customer dashboard data
     */
    public function getCustomerDashboard(int $userId): array
    {
        $user = User::find($userId);
        
        return [
            'total_bookings' => $user->bookings()->count(),
            'active_bookings' => $user->bookings()->where('status', 'active')->count(),
            'completed_bookings' => $user->bookings()->where('status', 'completed')->count(),
            'cancelled_bookings' => $user->bookings()->where('status', 'cancelled')->count(),
            'total_spent' => $user->total_spent,
            'trust_score' => $user->trust_score,
            'wishlist_count' => $user->wishlist()->count(),
            'unread_notifications' => $user->notifications()->where('is_read', false)->count(),
        ];
    }

    /**
     * Get monthly revenue for vendor
     */
    public function getMonthlyRevenue(int $vendorId): array
    {
        $monthlyData = DB::table('bookings')
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('SUM(platform_fee) as commission'),
                DB::raw('SUM(vendor_payment) as net')
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
                'commission' => $item->commission,
                'net' => $item->net,
            ];
        })->toArray();
    }

    /**
     * Get revenue data for vendor
     */
    public function getRevenueData(int $vendorId, string $period = 'monthly'): array
    {
        $query = Booking::where('vendor_id', $vendorId)
            ->where('status', 'completed');

        switch ($period) {
            case 'daily':
                $query->whereDate('created_at', today());
                break;
            case 'weekly':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'yearly':
                $query->whereYear('created_at', now()->year);
                break;
            default: // monthly
                $query->whereMonth('created_at', now()->month);
        }

        $bookings = $query->get();

        return [
            'total_revenue' => $bookings->sum('total_amount'),
            'total_commission' => $bookings->sum('platform_fee'),
            'net_revenue' => $bookings->sum('vendor_payment'),
            'total_bookings' => $bookings->count(),
            'average_booking_value' => $bookings->avg('total_amount') ?? 0,
        ];
    }

    /**
     * Get platform analytics
     */
    public function getPlatformAnalytics(string $period = 'monthly'): array
    {
        $startDate = now();
        
        switch ($period) {
            case 'weekly':
                $startDate = now()->subWeek();
                break;
            case 'monthly':
                $startDate = now()->subMonth();
                break;
            case 'yearly':
                $startDate = now()->subYear();
                break;
        }

        return [
            'new_users' => User::where('created_at', '>=', $startDate)->count(),
            'new_vendors' => User::where('role', 'vendor')
                ->where('created_at', '>=', $startDate)
                ->count(),
            'new_bookings' => Booking::where('created_at', '>=', $startDate)->count(),
            'revenue' => Booking::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->sum('total_amount'),
            'commission' => Booking::where('status', 'completed')
                ->where('created_at', '>=', $startDate)
                ->sum('platform_fee'),
            'growth_rate' => $this->calculateGrowthRate($period),
        ];
    }

    /**
     * Calculate growth rate
     */
    private function calculateGrowthRate(string $period): float
    {
        $currentPeriod = Booking::where('status', 'completed')
            ->where('created_at', '>=', now()->subMonth())
            ->count();

        $previousPeriod = Booking::where('status', 'completed')
            ->whereBetween('created_at', [now()->subMonths(2), now()->subMonth()])
            ->count();

        if ($previousPeriod == 0) {
            return $currentPeriod > 0 ? 100 : 0;
        }

        return round((($currentPeriod - $previousPeriod) / $previousPeriod) * 100, 2);
    }
}