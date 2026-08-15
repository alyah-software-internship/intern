<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\VendorService;
use App\Services\ProductService;
use App\Services\BookingService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{
    protected $vendorService;
    protected $productService;
    protected $bookingService;
    protected $notificationService;

    public function __construct(
        VendorService $vendorService,
        ProductService $productService,
        BookingService $bookingService,
        NotificationService $notificationService
    ) {
        $this->vendorService = $vendorService;
        $this->productService = $productService;
        $this->bookingService = $bookingService;
        $this->notificationService = $notificationService;
    }

    /**
     * Register as a vendor
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string|max:100',
            'description' => 'required|string',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'tax_id' => 'nullable|string|max:100',
            'registration_number' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = $this->vendorService->register(
                $request->user()->id,
                $request->all()
            );

            // Notify admin
            $this->notificationService->createNotification(
                1, // Admin user ID
                'vendor_registration',
                'New Vendor Registration',
                "A new vendor has registered: {$vendor->business_name}",
                '/admin/vendors',
                'high',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Vendor registration submitted successfully',
                'vendor' => $vendor,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to register as vendor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor dashboard
     */
    public function dashboard(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $stats = $this->vendorService->getVendorStatistics($vendor->id);
            $recentBookings = $this->bookingService->getVendorBookings($vendor->id, null, 5);

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'recent_bookings' => $recentBookings,
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
     * Get vendor products
     */
    public function products(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $products = $this->productService->getVendorProducts($vendor->id);

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor bookings
     */
    public function bookings(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $bookings = $this->bookingService->getVendorBookings(
                $vendor->id,
                $request->status ?? null
            );

            return response()->json([
                'success' => true,
                'bookings' => $bookings,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor revenue
     */
    public function revenue(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $revenue = $this->vendorService->getRevenueBreakdown($vendor->id);

            return response()->json([
                'success' => true,
                'revenue' => $revenue,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor revenue',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}