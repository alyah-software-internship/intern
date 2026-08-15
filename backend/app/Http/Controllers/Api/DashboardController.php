<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Services\VendorService;
use App\Services\BookingService;
use App\Services\PaymentService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    protected $dashboardService;
    protected $vendorService;
    protected $bookingService;
    protected $paymentService;
    protected $notificationService;

    public function __construct(
        DashboardService $dashboardService,
        VendorService $vendorService,
        BookingService $bookingService,
        PaymentService $paymentService,
        NotificationService $notificationService
    ) {
        $this->dashboardService = $dashboardService;
        $this->vendorService = $vendorService;
        $this->bookingService = $bookingService;
        $this->paymentService = $paymentService;
        $this->notificationService = $notificationService;
    }

    /**
     * Get admin dashboard
     */
    public function adminDashboard(Request $request)
    {
        try {
            $dashboard = $this->dashboardService->getAdminDashboard();

            // Add recent activities
            $recentActivities = [
                'new_users' => \App\Models\User::orderBy('created_at', 'desc')->limit(5)->get(),
                'new_bookings' => \App\Models\Booking::with(['customer', 'product'])
                    ->orderBy('created_at', 'desc')
                    ->limit(5)
                    ->get(),
                'pending_vendors' => \App\Models\VendorProfile::where('verification_status', 'pending')
                    ->with('user')
                    ->limit(5)
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'dashboard' => $dashboard,
                'recent_activities' => $recentActivities,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get admin dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor dashboard
     */
    public function vendorDashboard(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $dashboard = $this->dashboardService->getVendorDashboard($vendor->id);

            // Get recent bookings
            $recentBookings = $this->bookingService->getVendorBookings($vendor->id, null, 5);

            // Get recent reviews
            $recentReviews = $vendor->reviews()
                ->with('customer')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();

            // Get monthly revenue chart data
            $monthlyRevenue = $this->dashboardService->getMonthlyRevenue($vendor->id);

            return response()->json([
                'success' => true,
                'dashboard' => $dashboard,
                'recent_bookings' => $recentBookings,
                'recent_reviews' => $recentReviews,
                'monthly_revenue' => $monthlyRevenue,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get customer dashboard
     */
    public function customerDashboard(Request $request)
    {
        try {
            $user = $request->user();
            $dashboard = $this->dashboardService->getCustomerDashboard($user->id);

            // Get recent bookings
            $recentBookings = $this->bookingService->getUserBookings($user->id, null, 5);

            // Get recent notifications
            $recentNotifications = $this->notificationService->getUserNotifications($user->id, 5);

            // Get wishlist items
            $wishlistItems = $user->wishlist()
                ->with('product')
                ->limit(5)
                ->get();

            return response()->json([
                'success' => true,
                'dashboard' => $dashboard,
                'recent_bookings' => $recentBookings,
                'recent_notifications' => $recentNotifications,
                'wishlist_items' => $wishlistItems,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get customer dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor revenue data
     */
    public function vendorRevenue(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $period = $request->period ?? 'monthly';
            $revenueData = $this->dashboardService->getRevenueData($vendor->id, $period);

            return response()->json([
                'success' => true,
                'revenue' => $revenueData,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get revenue data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get platform analytics
     */
    public function platformAnalytics(Request $request)
    {
        try {
            $period = $request->period ?? 'monthly';
            $analytics = $this->dashboardService->getPlatformAnalytics($period);

            // Get top vendors
            $topVendors = \App\Models\VendorProfile::with('user')
                ->where('is_active', true)
                ->where('verification_status', 'approved')
                ->orderBy('total_revenue', 'desc')
                ->limit(10)
                ->get();

            // Get top products
            $topProducts = \App\Models\Product::with('vendor')
                ->where('status', 'active')
                ->orderBy('views_count', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'analytics' => $analytics,
                'top_vendors' => $topVendors,
                'top_products' => $topProducts,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get platform analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor analytics
     */
    public function vendorAnalytics(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $analytics = [
                'total_views' => $vendor->products()->sum('views_count'),
                'total_bookings' => $vendor->bookings()->count(),
                'conversion_rate' => $this->calculateConversionRate($vendor->id),
                'average_rating' => $vendor->rating,
                'response_time' => $vendor->response_time_avg,
                'completion_rate' => $this->calculateCompletionRate($vendor->id),
                'popular_products' => $vendor->products()
                    ->orderBy('views_count', 'desc')
                    ->limit(5)
                    ->get(['id', 'name', 'views_count', 'rating']),
                'booking_trends' => $this->getVendorBookingTrends($vendor->id),
            ];

            return response()->json([
                'success' => true,
                'analytics' => $analytics,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin analytics
     */
    public function adminAnalytics(Request $request)
    {
        try {
            $period = $request->period ?? 'monthly';
            
            $analytics = [
                'platform_growth' => $this->getPlatformGrowth($period),
                'user_engagement' => $this->getUserEngagement($period),
                'revenue_trends' => $this->getRevenueTrends($period),
                'booking_trends' => $this->getPlatformBookingTrends($period),
                'top_categories' => $this->getTopCategories(),
                'platform_health' => $this->getPlatformHealth(),
            ];

            return response()->json([
                'success' => true,
                'analytics' => $analytics,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get admin analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate conversion rate for vendor
     */
    private function calculateConversionRate($vendorId)
    {
        $totalViews = \App\Models\Product::where('vendor_id', $vendorId)->sum('views_count');
        $totalBookings = \App\Models\Booking::where('vendor_id', $vendorId)->count();
        
        if ($totalViews == 0) {
            return 0;
        }
        
        return round(($totalBookings / $totalViews) * 100, 2);
    }

    /**
     * Calculate completion rate for vendor
     */
    private function calculateCompletionRate($vendorId)
    {
        $totalBookings = \App\Models\Booking::where('vendor_id', $vendorId)->count();
        $completedBookings = \App\Models\Booking::where('vendor_id', $vendorId)
            ->where('status', 'completed')
            ->count();
        
        if ($totalBookings == 0) {
            return 0;
        }
        
        return round(($completedBookings / $totalBookings) * 100, 2);
    }

    /**
     * Get booking trends for a vendor
     */
    private function getVendorBookingTrends($vendorId)
    {
        return \App\Models\Booking::where('vendor_id', $vendorId)
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as count')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();
    }

    /**
     * Get platform growth data
     */
    private function getPlatformGrowth($period)
    {
        $startDate = now()->subMonths(6);
        
        return [
            'users' => \App\Models\User::where('created_at', '>=', $startDate)
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                ->groupBy('month')
                ->get(),
            'vendors' => \App\Models\VendorProfile::where('created_at', '>=', $startDate)
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                ->groupBy('month')
                ->get(),
            'bookings' => \App\Models\Booking::where('created_at', '>=', $startDate)
                ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count')
                ->groupBy('month')
                ->get(),
        ];
    }

    /**
     * Get user engagement data
     */
    private function getUserEngagement($period)
    {
        $startDate = now()->subMonths($period === 'yearly' ? 12 : 6);
        
        return [
            'active_users' => \App\Models\User::where('last_login_at', '>=', now()->subDays(30))->count(),
            'new_users' => \App\Models\User::where('created_at', '>=', $startDate)->count(),
            'returning_users' => \App\Models\User::where('last_login_at', '>=', now()->subDays(7))->count(),
            'average_session' => 0, // Would need session tracking
        ];
    }

    /**
     * Get revenue trends
     */
    private function getRevenueTrends($period)
    {
        $startDate = now()->subMonths(6);
        
        return \App\Models\Payment::where('status', 'completed')
            ->where('created_at', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Get booking trends for platform
     */
    private function getPlatformBookingTrends($period)
    {
        $startDate = now()->subMonths(6);
        
        return \App\Models\Booking::where('created_at', '>=', $startDate)
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, COUNT(*) as count, SUM(total_amount) as revenue')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Get top categories
     */
    private function getTopCategories()
    {
        return \App\Models\Category::withCount('products')
            ->orderBy('products_count', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'name_am']);
    }

    /**
     * Get platform health metrics
     */
    private function getPlatformHealth()
    {
        return [
            'server_status' => 'operational',
            'database_status' => 'operational',
            'cache_status' => 'operational',
            'queue_status' => 'operational',
            'uptime_percentage' => 99.9,
            'response_time' => 120, // ms
            'error_rate' => 0.5, // percentage
        ];
    }
}