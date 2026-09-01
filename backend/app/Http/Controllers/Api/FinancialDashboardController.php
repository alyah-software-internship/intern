<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\Booking;
use App\Models\VendorPayout;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FinancialDashboardController extends Controller
{
    /**
     * Get admin financial dashboard
     * GET /api/admin/financial-dashboard
     */
    public function index(Request $request)
    {
        try {
            // Total payments
            $totalPayments = Payment::where('status', 'completed')->sum('amount');

            // Platform revenue (from all platform fees)
            $platformRevenue = Payment::where('status', 'completed')->sum('platform_fee');

            // Total vendor earnings
            $totalVendorEarnings = Booking::where('status', 'completed')->sum('vendor_payment');

            // Pending vendor earnings (not yet released)
            $pendingVendorEarnings = Wallet::sum('pending_balance');

            // Available vendor balance (ready for withdrawal)
            $availableVendorBalance = Wallet::sum('balance');

            // Total withdrawals completed
            $totalWithdrawals = VendorPayout::where('status', 'completed')->sum('amount');

            // Pending withdrawals (approved but not completed)
            $pendingWithdrawals = VendorPayout::whereIn('payout_status', ['pending', 'approved', 'processing'])
                ->sum('amount');

            // Total completed withdrawals
            $completedWithdrawals = VendorPayout::where('payout_status', 'completed')->sum('amount');

            // Refunds
            $totalRefunds = Refund::where('status', 'completed')->sum('amount');

            // Failed payments
            $failedPaymentCount = Payment::where('status', 'failed')->count();
            $failedPaymentAmount = Payment::where('status', 'failed')->sum('amount');

            // Dashboard data
            $dashboard = [
                'total_payments' => (float) $totalPayments,
                'platform_revenue' => (float) $platformRevenue,
                'total_vendor_earnings' => (float) $totalVendorEarnings,
                'pending_vendor_earnings' => (float) $pendingVendorEarnings,
                'available_vendor_balance' => (float) $availableVendorBalance,
                'total_withdrawals' => (float) $totalWithdrawals,
                'pending_withdrawals' => (float) $pendingWithdrawals,
                'completed_withdrawals' => (float) $completedWithdrawals,
                'total_refunds' => (float) $totalRefunds,
                'failed_payments_count' => $failedPaymentCount,
                'failed_payments_amount' => (float) $failedPaymentAmount,
                'currency' => 'ETB',
            ];

            return response()->json([
                'success' => true,
                'dashboard' => $dashboard,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get financial dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment analytics
     * GET /api/admin/payments/analytics
     */
    public function paymentAnalytics(Request $request)
    {
        try {
            $startDate = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date')) : now()->subMonth();
            $endDate = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date')) : now();

            // Payments by status
            $paymentsByStatus = Payment::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('status, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('status')
                ->get();

            // Payments by method
            $paymentsByMethod = Payment::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('payment_method')
                ->get();

            // Daily payment trends
            $dailyTrends = Payment::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'completed')
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Top vendors by revenue
            $topVendors = Booking::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'completed')
                ->with('vendor.user')
                ->selectRaw('vendor_id, COUNT(*) as booking_count, SUM(vendor_payment) as total_revenue')
                ->groupBy('vendor_id')
                ->orderByDesc('total_revenue')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'analytics' => [
                    'payments_by_status' => $paymentsByStatus,
                    'payments_by_method' => $paymentsByMethod,
                    'daily_trends' => $dailyTrends,
                    'top_vendors' => $topVendors,
                    'period' => [
                        'start_date' => $startDate->toDateString(),
                        'end_date' => $endDate->toDateString(),
                    ],
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get payment analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get withdrawal analytics
     * GET /api/admin/withdrawals/analytics
     */
    public function withdrawalAnalytics(Request $request)
    {
        try {
            $startDate = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date')) : now()->subMonth();
            $endDate = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date')) : now();

            // Withdrawals by status
            $withdrawalsByStatus = VendorPayout::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('payout_status, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('payout_status')
                ->get();

            // Daily withdrawal trends
            $dailyTrends = VendorPayout::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Average withdrawal time (days from request to completion)
            $completedWithdrawals = VendorPayout::whereBetween('created_at', [$startDate, $endDate])
                ->where('payout_status', 'completed')
                ->whereNotNull('completed_at')
                ->selectRaw('AVG(DATEDIFF(completed_at, created_at)) as avg_days')
                ->first();

            return response()->json([
                'success' => true,
                'analytics' => [
                    'withdrawals_by_status' => $withdrawalsByStatus,
                    'daily_trends' => $dailyTrends,
                    'avg_processing_days' => $completedWithdrawals?->avg_days ?? 0,
                    'period' => [
                        'start_date' => $startDate->toDateString(),
                        'end_date' => $endDate->toDateString(),
                    ],
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get withdrawal analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get refund analytics
     * GET /api/admin/refunds/analytics
     */
    public function refundAnalytics(Request $request)
    {
        try {
            $startDate = $request->input('start_date') ? \Carbon\Carbon::parse($request->input('start_date')) : now()->subMonth();
            $endDate = $request->input('end_date') ? \Carbon\Carbon::parse($request->input('end_date')) : now();

            // Refunds by status
            $refundsByStatus = Refund::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('status, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('status')
                ->get();

            // Refunds by reason
            $refundsByReason = Refund::whereBetween('created_at', [$startDate, $endDate])
                ->selectRaw('reason, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('reason')
                ->get();

            // Daily refund trends
            $dailyTrends = Refund::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', 'completed')
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count, SUM(amount) as total_amount')
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return response()->json([
                'success' => true,
                'analytics' => [
                    'refunds_by_status' => $refundsByStatus,
                    'refunds_by_reason' => $refundsByReason,
                    'daily_trends' => $dailyTrends,
                    'period' => [
                        'start_date' => $startDate->toDateString(),
                        'end_date' => $endDate->toDateString(),
                    ],
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get refund analytics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor financial summary
     * GET /api/admin/vendors/:vendorId/financial-summary
     */
    public function vendorSummary($vendorId, Request $request)
    {
        try {
            // Total earnings
            $totalEarnings = Booking::where('vendor_id', $vendorId)
                ->where('status', 'completed')
                ->sum('vendor_payment');

            // Pending earnings
            $pendingEarnings = Wallet::whereHas('user', function ($query) use ($vendorId) {
                $query->whereHas('vendorProfile', function ($q) use ($vendorId) {
                    $q->where('id', $vendorId);
                });
            })->sum('pending_balance');

            // Available balance
            $availableBalance = Wallet::whereHas('user', function ($query) use ($vendorId) {
                $query->whereHas('vendorProfile', function ($q) use ($vendorId) {
                    $q->where('id', $vendorId);
                });
            })->sum('balance');

            // Total withdrawn
            $totalWithdrawn = VendorPayout::where('vendor_id', $vendorId)
                ->where('payout_status', 'completed')
                ->sum('amount');

            // Pending withdrawals
            $pendingWithdrawals = VendorPayout::where('vendor_id', $vendorId)
                ->whereIn('payout_status', ['pending', 'approved', 'processing'])
                ->sum('amount');

            // Completed bookings
            $completedBookings = Booking::where('vendor_id', $vendorId)
                ->where('status', 'completed')
                ->count();

            // Total refunds for this vendor
            $totalRefunds = Refund::where('vendor_id', $vendorId)
                ->where('status', 'completed')
                ->sum('amount');

            return response()->json([
                'success' => true,
                'summary' => [
                    'total_earnings' => (float) $totalEarnings,
                    'pending_earnings' => (float) $pendingEarnings,
                    'available_balance' => (float) $availableBalance,
                    'total_withdrawn' => (float) $totalWithdrawn,
                    'pending_withdrawals' => (float) $pendingWithdrawals,
                    'completed_bookings' => $completedBookings,
                    'total_refunds' => (float) $totalRefunds,
                    'currency' => 'ETB',
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor financial summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get wallet transactions for audit trail
     * GET /api/admin/wallet-transactions
     */
    public function walletTransactions(Request $request)
    {
        try {
            $query = WalletTransaction::with(['wallet.user', 'booking', 'payment'])
                ->orderBy('created_at', 'desc');

            // Filter by vendor
            if ($request->vendor_id) {
                $query->whereHas('wallet', function ($q) use ($request) {
                    $q->whereHas('user', function ($u) {
                        $u->where('vendor_profiles.id', $request->vendor_id);
                    });
                });
            }

            // Filter by type
            if ($request->type) {
                $query->where('type', $request->type);
            }

            // Filter by date range
            if ($request->start_date) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->end_date) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            $transactions = $query->paginate($request->per_page ?? 50);

            return response()->json([
                'success' => true,
                'transactions' => $transactions,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get wallet transactions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
