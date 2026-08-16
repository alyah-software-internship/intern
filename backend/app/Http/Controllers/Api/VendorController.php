<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VendorProfile;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VendorController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Register as a vendor
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'business_name_am' => 'nullable|string|max:255',
            'business_type' => 'required|string|max:100',
            'business_type_am' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'description_am' => 'nullable|string',
            'address' => 'required|string|max:500',
            'address_am' => 'nullable|string|max:500',
            'city' => 'required|string|max:100',
            'city_am' => 'nullable|string|max:100',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
            'tax_id' => 'nullable|string|max:100',
            'registration_number' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Check if user already has a vendor profile
            $existingVendor = VendorProfile::where('user_id', $request->user()->id)->first();
            if ($existingVendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are already registered as a vendor'
                ], 400);
            }

            // Create vendor profile with AUTO-APPROVED status (for testing)
            $vendor = VendorProfile::create([
                'user_id' => $request->user()->id,
                'business_name' => $request->business_name,
                'business_name_am' => $request->business_name_am,
                'business_type' => $request->business_type,
                'business_type_am' => $request->business_type_am,
                'description' => $request->description,
                'description_am' => $request->description_am,
                'address' => $request->address,
                'address_am' => $request->address_am,
                'city' => $request->city,
                'city_am' => $request->city_am,
                'phone' => $request->phone,
                'email' => $request->email,
                'website' => $request->website,
                'tax_id' => $request->tax_id,
                'registration_number' => $request->registration_number,
                'verification_status' => 'approved', // ✅ Auto-approve for testing
                'is_active' => true,
                'joined_date' => now(),
            ]);

            // Update user role to vendor
            $user = User::find($request->user()->id);
            $user->role = 'vendor';
            $user->save();

            // Send notification
            $this->notificationService->createNotification(
                $user->id,
                'vendor_approved',
                'Vendor Registration Approved',
                'Your vendor registration has been approved. You can now start listing products.',
                '/vendor/dashboard',
                'high',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Vendor registration approved successfully',
                'vendor' => $vendor,
                'user' => $user,
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
                    'message' => 'Vendor profile not found'
                ], 404);
            }

            $stats = [
                'total_products' => $vendor->products()->count(),
                'active_products' => $vendor->products()->where('status', 'active')->count(),
                'total_bookings' => $vendor->bookings()->count(),
                'pending_bookings' => $vendor->bookings()->where('status', 'pending')->count(),
                'active_bookings' => $vendor->bookings()->where('status', 'active')->count(),
                'completed_bookings' => $vendor->bookings()->where('status', 'completed')->count(),
                'total_revenue' => $vendor->total_revenue ?? 0,
                'pending_payouts' => $vendor->pending_payouts ?? 0,
                'rating' => $vendor->rating ?? 0,
                'total_reviews' => $vendor->total_reviews ?? 0,
            ];

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'vendor' => $vendor,
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
                    'message' => 'Vendor profile not found'
                ], 404);
            }

            $products = $vendor->products()->with(['category', 'images'])->get();

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
                    'message' => 'Vendor profile not found'
                ], 404);
            }

            $query = $vendor->bookings()->with(['product', 'customer']);
            
            if ($request->status) {
                $query->where('status', $request->status);
            }

            $bookings = $query->orderBy('created_at', 'desc')->get();

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
                    'message' => 'Vendor profile not found'
                ], 404);
            }

            $completedBookings = $vendor->bookings()->where('status', 'completed')->get();
            
            $revenue = [
                'total_revenue' => $completedBookings->sum('total_amount'),
                'platform_commission' => $completedBookings->sum('platform_fee'),
                'net_earnings' => $completedBookings->sum('vendor_payment'),
                'bookings_count' => $completedBookings->count(),
                'average_booking_value' => $completedBookings->avg('total_amount') ?? 0,
            ];

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