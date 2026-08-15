<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VendorService;
use App\Services\BookingService;
use App\Services\PaymentService;
use App\Services\ReportService;
use App\Services\NotificationService;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    protected $vendorService;
    protected $bookingService;
    protected $paymentService;
    protected $reportService;
    protected $notificationService;

    public function __construct(
        VendorService $vendorService,
        BookingService $bookingService,
        PaymentService $paymentService,
        ReportService $reportService,
        NotificationService $notificationService
    ) {
        $this->vendorService = $vendorService;
        $this->bookingService = $bookingService;
        $this->paymentService = $paymentService;
        $this->reportService = $reportService;
        $this->notificationService = $notificationService;
    }

    /**
     * Get admin dashboard stats
     */
    public function dashboard(Request $request)
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'total_vendors' => User::where('role', 'vendor')->count(),
                'total_customers' => User::where('role', 'customer')->count(),
                'total_products' => Product::count(),
                'total_bookings' => $this->bookingService->getAllBookings()->count(),
                'pending_bookings' => $this->bookingService->getPendingBookings()->count(),
                'total_revenue' => $this->paymentService->getTotalRevenue(),
                'platform_commission' => $this->paymentService->getTotalCommission(),
                'pending_vendors' => $this->vendorService->getPendingVendors()->count(),
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats,
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
     * Get all users
     */
    public function users(Request $request)
    {
        try {
            $users = User::with('vendorProfile')
                ->when($request->role, function ($query, $role) {
                    return $query->where('role', $role);
                })
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'users' => $users,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get pending vendor registrations
     */
    public function pendingVendors(Request $request)
    {
        try {
            $vendors = $this->vendorService->getPendingVendors();

            return response()->json([
                'success' => true,
                'vendors' => $vendors,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get pending vendors',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve vendor registration
     */
    public function approveVendor($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = $this->vendorService->approveVendor($id, $request->notes);

            $this->notificationService->createNotification(
                $vendor->user_id,
                'vendor_approved',
                'Vendor Registration Approved',
                'Congratulations! Your vendor registration has been approved.',
                '/vendor/dashboard',
                'high',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Vendor approved successfully',
                'vendor' => $vendor,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve vendor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject vendor registration
     */
    public function rejectVendor($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $this->vendorService->rejectVendor($id, $request->reason);

            $this->notificationService->createNotification(
                $id,
                'vendor_rejected',
                'Vendor Registration Rejected',
                "Your vendor registration has been rejected. Reason: {$request->reason}",
                '/vendor/register',
                'high',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Vendor rejected successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject vendor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ban user
     */
    public function banUser($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = User::findOrFail($id);
            $user->update([
                'is_banned' => true,
                'banned_reason' => $request->reason,
                'banned_at' => now(),
            ]);

            $this->notificationService->createNotification(
                $id,
                'user_banned',
                'Account Banned',
                "Your account has been banned. Reason: {$request->reason}",
                '/',
                'urgent',
                'security'
            );

            return response()->json([
                'success' => true,
                'message' => 'User banned successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to ban user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unban user
     */
    public function unbanUser($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update([
                'is_banned' => false,
                'banned_reason' => null,
                'banned_at' => null,
            ]);

            $this->notificationService->createNotification(
                $id,
                'user_unbanned',
                'Account Unbanned',
                'Your account has been unbanned.',
                '/',
                'high',
                'security'
            );

            return response()->json([
                'success' => true,
                'message' => 'User unbanned successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to unban user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get platform reports
     */
    public function reports(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:users,revenue,products,vendors,bookings,payments',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date|after:date_from',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $report = null;
            $filters = $request->only(['date_from', 'date_to', 'vendor_id', 'status']);

            switch ($request->type) {
                case 'users':
                    $report = $this->reportService->generateUserReport($filters);
                    break;
                case 'revenue':
                    $report = $this->reportService->generateRevenueReport($filters);
                    break;
                case 'products':
                    $report = $this->reportService->generateProductReport($filters);
                    break;
                case 'vendors':
                    $report = $this->reportService->generateVendorReport($filters);
                    break;
                case 'bookings':
                    $report = $this->reportService->getBookingReport($filters);
                    break;
                case 'payments':
                    $report = $this->reportService->getPaymentReport($filters);
                    break;
            }

            return response()->json([
                'success' => true,
                'report' => $report,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate report',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}