<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\IdentityDocument;
use App\Models\VendorPaymentMethod;
use App\Models\VendorProfile;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
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

            // New vendor profiles remain pending until an administrator reviews them.
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
                'verification_status' => 'pending',
                'is_active' => false,
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

    public function profile(Request $request)
    {
        $vendor = VendorProfile::with('paymentMethods')
            ->where('user_id', $request->user()->id)
            ->first();

        return response()->json([
            'success' => true,
            'vendor' => $vendor,
            'identity_documents' => $vendor ? $request->user()->identityDocuments()->latest()->get() : [],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'business_name' => 'required|string|max:255',
            'business_name_am' => 'nullable|string|max:255',
            'business_type' => 'required|string|max:100',
            'business_type_am' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'description_am' => 'nullable|string',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'country' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:30',
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
                'errors' => $validator->errors(),
            ], 422);
        }

        $vendor = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor profile not found',
            ], 404);
        }

        $vendor->update($request->only([
            'business_name', 'business_name_am', 'business_type', 'business_type_am',
            'description', 'description_am', 'address', 'city', 'country', 'postal_code',
            'phone', 'email', 'website', 'tax_id', 'registration_number',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Business profile updated successfully',
            'vendor' => $vendor->fresh('paymentMethods'),
            'identity_documents' => $request->user()->identityDocuments()->latest()->get(),
        ]);
    }

    public function submitVerification(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document_type' => 'required|in:national_id,passport,drivers_license,voter_id',
            'document_number' => 'required|string|max:100',
            'document_country' => 'required|string|max:100',
            'document_front' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
            'document_back' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
            'selfie_with_document' => 'nullable|image|mimes:jpeg,jpg,png|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Verification validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $vendor = VendorProfile::where('user_id', $request->user()->id)->first();

        if (!$vendor) {
            return response()->json([
                'success' => false,
                'message' => 'Please register your vendor profile before submitting verification.',
            ], 422);
        }

        $vendor = DB::transaction(function () use ($request, $vendor) {
            IdentityDocument::where('user_id', $request->user()->id)
                ->where('is_primary', true)
                ->update(['is_primary' => false]);

            $documentUrls = [];
            foreach ([
                'document_front' => 'document_front_url',
                'document_back' => 'document_back_url',
                'selfie_with_document' => 'selfie_with_document_url',
            ] as $fileKey => $column) {
                if ($request->hasFile($fileKey)) {
                    $documentUrls[$column] = asset('storage/' . $request->file($fileKey)->store('identity-documents', 'public'));
                }
            }

            IdentityDocument::create([
                'user_id' => $request->user()->id,
                'document_type' => $request->document_type,
                'document_number' => $request->document_number,
                'document_country' => $request->document_country,
                ...$documentUrls,
                'verification_status' => 'pending',
                'is_primary' => true,
                'verified_at' => null,
            ]);

            $vendor->update([
                'identity_verified' => false,
                'verification_status' => 'pending',
                'is_active' => false,
                'verification_approved_at' => null,
            ]);

            return $vendor->fresh('paymentMethods');
        });

        return response()->json([
            'success' => true,
            'message' => 'Verification submitted successfully',
            'vendor' => $vendor,
        ]);
    }

    public function addPaymentMethod(Request $request)
    {
        $vendor = VendorProfile::where('user_id', $request->user()->id)->firstOrFail();
        $data = $this->validatePaymentMethod($request);

        if (!empty($data['is_primary'])) {
            $vendor->paymentMethods()->update(['is_primary' => false]);
        }

        // Vendor-owned payout methods are verified when they are added.
        // Admin verification is handled separately for vendor onboarding.
        $data['verification_status'] = 'verified';
        $data['verified_at'] = now();
        $paymentMethod = $vendor->paymentMethods()->create($data);

        return response()->json([
            'success' => true,
            'message' => 'Payment method added successfully',
            'payment_method' => $paymentMethod,
        ], 201);
    }

    public function updatePaymentMethod(Request $request, $id)
    {
        $vendor = VendorProfile::where('user_id', $request->user()->id)->firstOrFail();
        $paymentMethod = $vendor->paymentMethods()->findOrFail($id);
        $data = $this->validatePaymentMethod($request);

        if (!empty($data['is_primary'])) {
            $vendor->paymentMethods()->where('id', '!=', $paymentMethod->id)->update(['is_primary' => false]);
        }

        $paymentMethod->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Payment method updated successfully',
            'payment_method' => $paymentMethod->fresh(),
        ]);
    }

    public function deletePaymentMethod(Request $request, $id)
    {
        $vendor = VendorProfile::where('user_id', $request->user()->id)->firstOrFail();
        $paymentMethod = $vendor->paymentMethods()->findOrFail($id);
        $paymentMethod->delete();

        return response()->json(['success' => true, 'message' => 'Payment method deleted successfully']);
    }

    private function validatePaymentMethod(Request $request): array
    {
        return Validator::make($request->all(), [
            'payment_type' => 'required|in:telebirr,cbe,boa',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:100',
            'bank_name' => 'nullable|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
            'mobile_provider' => 'nullable|string|max:100',
            'mobile_number' => 'nullable|string|max:50',
            'is_primary' => 'boolean',
            'is_active' => 'boolean',
        ])->validate();
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

            $bookings = $vendor->bookings();
            $wallet = $request->user()->wallet;
            $completedBookings = (clone $bookings)
                ->where('status', 'completed')
                ->where('payment_status', 'paid');
            $monthlyRevenue = (clone $bookings)
                ->where('status', 'completed')
                ->where('payment_status', 'paid')
                ->where('completed_at', '>=', now()->subMonths(5)->startOfMonth())
                ->selectRaw("DATE_FORMAT(completed_at, '%Y-%m') as month, SUM(vendor_payment) as amount")
                ->groupBy('month')
                ->orderBy('month')
                ->pluck('amount', 'month');

            $revenueByMonth = collect(range(5, 0))->map(function ($monthsAgo) use ($monthlyRevenue) {
                $month = now()->subMonths($monthsAgo);
                $key = $month->format('Y-m');

                return [
                    'month' => $month->format('M'),
                    'amount' => (float) ($monthlyRevenue[$key] ?? 0),
                ];
            })->values();

            $stats = [
                'total_products' => $vendor->products()->count(),
                'active_products' => $vendor->products()->where('status', 'active')->count(),
                'total_bookings' => (clone $bookings)->count(),
                'pending_bookings' => (clone $bookings)->where('status', 'pending')->count(),
                'active_bookings' => (clone $bookings)->whereIn('status', ['confirmed', 'active'])->count(),
                'completed_bookings' => (clone $completedBookings)->count(),
                'total_revenue' => (float) $completedBookings->sum('vendor_payment'),
                'pending_payouts' => (float) ($wallet?->pending_balance ?? 0),
                'revenue_by_month' => $revenueByMonth,
                'rating' => $vendor->rating ?? 0,
                'total_reviews' => $vendor->reviews()->count(),
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

    public function subscription(Request $request)
    {
        $vendor = $request->user()->vendorProfile;

        if (!$vendor) {
            return response()->json(['success' => false, 'message' => 'Vendor profile not found'], 404);
        }

        if ($vendor->subscription_status === 'active' && $vendor->subscription_expires_at?->isPast()) {
            $vendor->update(['subscription_status' => 'expired']);
        }

        return response()->json(['success' => true, 'subscription' => $vendor->fresh()->only([
            'subscription_plan', 'subscription_status', 'subscription_expires_at',
        ])]);
    }

    public function subscribe(Request $request)
    {
        $request->validate(['plan' => 'required|in:basic,premium,enterprise']);
        $vendor = $request->user()->vendorProfile;

        if (!$vendor) {
            return response()->json(['success' => false, 'message' => 'Vendor profile not found'], 404);
        }

        $prices = ['basic' => 2900, 'premium' => 9900, 'enterprise' => 24900];
        try {
            $payment = app(\App\Services\PaymentService::class)->initiateSubscriptionPayment(
                $vendor,
                $request->plan,
                $prices[$request->plan],
                $request->input('provider', 'mock')
            );
            return response()->json($payment);
        } catch (\Throwable $exception) {
            return response()->json(['success' => false, 'message' => 'Unable to initiate subscription payment', 'error' => $exception->getMessage()], 500);
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
     * Get one product belonging to the authenticated vendor.
     */
    public function product(Request $request, $id)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            $product = $vendor?->products()->with(['category', 'images'])->find($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'product' => $product,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor product.',
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