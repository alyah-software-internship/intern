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
            'business_name' => 'required|string|max:255',
            'business_type' => 'required|string|max:100',
            'business_description' => 'nullable|string',
            'business_address' => 'required|string|max:500',
            'business_city' => 'required|string|max:100',
            'business_phone' => 'required|string|max:50',
            'business_email' => 'nullable|email|max:255',
            'registration_number' => 'nullable|string|max:100',
            'payment_type' => 'required|in:bank_transfer,mobile_money,paypal,stripe,chapa,telebirr',
            'account_name' => 'required|string|max:255',
            'account_number' => 'required|string|max:100',
            'bank_name' => 'nullable|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
            'mobile_provider' => 'nullable|string|max:100',
            'mobile_number' => 'nullable|string|max:50',
            'paypal_email' => 'nullable|email|max:255',
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
            $vendor = VendorProfile::create([
                'user_id' => $request->user()->id,
                'business_name' => $request->business_name,
                'business_type' => $request->business_type,
                'description' => $request->business_description,
                'address' => $request->business_address,
                'city' => $request->business_city,
                'phone' => $request->business_phone,
                'email' => $request->business_email,
                'registration_number' => $request->registration_number,
                'verification_status' => 'pending',
                'is_active' => true,
                'joined_date' => now(),
            ]);
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
                'verification_status' => 'verified',
                'is_primary' => true,
                'verified_at' => now(),
            ]);

            $vendor->paymentMethods()->update(['is_primary' => false]);
            $vendor->paymentMethods()->create([
                'payment_type' => $request->payment_type,
                'account_name' => $request->account_name,
                'account_number' => $request->account_number,
                'bank_name' => $request->bank_name,
                'bank_branch' => $request->bank_branch,
                'mobile_provider' => $request->mobile_provider,
                'mobile_number' => $request->mobile_number,
                'paypal_email' => $request->paypal_email,
                'is_primary' => true,
                'is_active' => true,
                'verification_status' => 'verified',
                'verified_at' => now(),
            ]);

            $vendor->update([
                'business_name' => $request->business_name,
                'business_type' => $request->business_type,
                'description' => $request->business_description,
                'address' => $request->business_address,
                'city' => $request->business_city,
                'phone' => $request->business_phone,
                'email' => $request->business_email,
                'registration_number' => $request->registration_number,
                'identity_verified' => true,
                'payment_methods_verified' => true,
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
            'payment_type' => 'required|in:bank_transfer,mobile_money,paypal,stripe,chapa,telebirr,other',
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