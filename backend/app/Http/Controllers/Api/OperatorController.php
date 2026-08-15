<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Operator;
use App\Models\OperatorAvailability;
use App\Models\Product;
use App\Models\VendorProfile;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OperatorController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all operators for the authenticated vendor
     */
    public function index(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $operators = Operator::where('vendor_id', $vendor->id)
                ->with(['user', 'assignedProducts'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'operators' => $operators,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get operators',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all available operators
     */
    public function available(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $operators = Operator::where('vendor_id', $vendor->id)
                ->where('is_active', true)
                ->where('available_status', 'available')
                ->where('verification_status', 'verified')
                ->with(['user', 'assignedProducts'])
                ->orderBy('rating', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'operators' => $operators,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get available operators',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new operator
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'required|string|max:255',
            'full_name_am' => 'nullable|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'specialization' => 'nullable|string|max:255',
            'specialization_am' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'daily_rate' => 'nullable|numeric|min:0',
            'weekly_rate' => 'nullable|numeric|min:0',
            'monthly_rate' => 'nullable|numeric|min:0',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'certification_url' => 'nullable|string|max:500',
            'id_document_url' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            // Handle profile image upload
            $profileImageUrl = null;
            if ($request->hasFile('profile_image')) {
                $path = $request->file('profile_image')->store('public/operators');
                $profileImageUrl = asset('storage/' . str_replace('public/', '', $path));
            }

            $operator = Operator::create([
                'vendor_id' => $vendor->id,
                'user_id' => $request->user()->id,
                'full_name' => $request->full_name,
                'full_name_am' => $request->full_name_am,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'specialization' => $request->specialization,
                'specialization_am' => $request->specialization_am,
                'experience_years' => $request->experience_years ?? 0,
                'hourly_rate' => $request->hourly_rate ?? 0,
                'daily_rate' => $request->daily_rate ?? 0,
                'weekly_rate' => $request->weekly_rate ?? 0,
                'monthly_rate' => $request->monthly_rate ?? 0,
                'bio' => $request->bio,
                'profile_image_url' => $profileImageUrl,
                'certification_url' => $request->certification_url,
                'id_document_url' => $request->id_document_url,
                'is_active' => true,
                'verification_status' => 'pending',
                'available_status' => 'available',
            ]);

            // Create notification
            $this->notificationService->createNotification(
                $request->user()->id,
                'operator_created',
                'Operator Created',
                "Operator {$operator->full_name} has been created successfully.",
                "/vendor/operators/{$operator->id}",
                'medium',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Operator created successfully',
                'operator' => $operator,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific operator
     */
    public function show($id, Request $request)
    {
        try {
            $operator = Operator::with(['vendor', 'assignedProducts', 'availability'])
                ->findOrFail($id);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view this operator'
                ], 403);
            }

            // Get upcoming assignments
            $upcomingAssignments = $operator->bookings()
                ->where('status', 'confirmed')
                ->where('start_date', '>=', now())
                ->with(['product', 'customer'])
                ->get();

            return response()->json([
                'success' => true,
                'operator' => $operator,
                'upcoming_assignments' => $upcomingAssignments,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Operator not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update an operator
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|string|max:255',
            'full_name_am' => 'nullable|string|max:255',
            'phone' => 'sometimes|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'specialization' => 'nullable|string|max:255',
            'specialization_am' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0',
            'hourly_rate' => 'nullable|numeric|min:0',
            'daily_rate' => 'nullable|numeric|min:0',
            'weekly_rate' => 'nullable|numeric|min:0',
            'monthly_rate' => 'nullable|numeric|min:0',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'is_active' => 'nullable|boolean',
            'available_status' => 'nullable|in:available,busy,on_leave,unavailable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = Operator::findOrFail($id);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this operator'
                ], 403);
            }

            // Handle profile image upload
            if ($request->hasFile('profile_image')) {
                $path = $request->file('profile_image')->store('public/operators');
                $request->merge(['profile_image_url' => asset('storage/' . str_replace('public/', '', $path))]);
            }

            $operator->update($request->all());

            // Create notification
            $this->notificationService->createNotification(
                $request->user()->id,
                'operator_updated',
                'Operator Updated',
                "Operator {$operator->full_name} has been updated.",
                "/vendor/operators/{$operator->id}",
                'low',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Operator updated successfully',
                'operator' => $operator,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete an operator (soft delete)
     */
    public function destroy($id, Request $request)
    {
        try {
            $operator = Operator::findOrFail($id);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this operator'
                ], 403);
            }

            // Check if operator has active bookings
            $activeBookings = $operator->bookings()
                ->whereIn('status', ['confirmed', 'active'])
                ->count();

            if ($activeBookings > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete operator with {$activeBookings} active booking(s)"
                ], 400);
            }

            $operatorName = $operator->full_name;
            $operator->delete();

            // Create notification
            $this->notificationService->createNotification(
                $request->user()->id,
                'operator_deleted',
                'Operator Deleted',
                "Operator {$operatorName} has been deleted.",
                '/vendor/operators',
                'low',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Operator deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign operator to product
     */
    public function assignToProduct(Request $request, $operatorId)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'is_primary' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = Operator::findOrFail($operatorId);
            $vendor = $request->user()->vendorProfile;

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $vendor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to assign this operator'
                ], 403);
            }

            $product = Product::findOrFail($request->product_id);

            // Check if vendor owns this product
            if ($product->vendor_id !== $vendor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to assign to this product'
                ], 403);
            }

            // Check if operator is already assigned to this product
            $existingAssignment = $operator->assignedProducts()
                ->where('product_id', $product->id)
                ->exists();

            if ($existingAssignment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Operator is already assigned to this product'
                ], 400);
            }

            // Assign operator to product
            $operator->assignedProducts()->attach($product->id, [
                'is_primary' => $request->is_primary ?? false,
                'is_active' => true,
                'assignment_date' => now(),
            ]);

            // If this is primary, remove primary from other operators
            if ($request->is_primary) {
                $operator->assignedProducts()->updateExistingPivot($product->id, ['is_primary' => false]);
                $operator->assignedProducts()->updateExistingPivot($product->id, ['is_primary' => true]);
            }

            // Create notification
            $this->notificationService->createNotification(
                $request->user()->id,
                'operator_assigned',
                'Operator Assigned to Product',
                "Operator {$operator->full_name} has been assigned to {$product->name}.",
                "/vendor/products/{$product->id}",
                'medium',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Operator assigned to product successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to assign operator to product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove operator from product
     */
    public function removeFromProduct(Request $request, $operatorId, $productId)
    {
        try {
            $operator = Operator::findOrFail($operatorId);
            $vendor = $request->user()->vendorProfile;

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $vendor->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to remove this operator'
                ], 403);
            }

            $operator->assignedProducts()->detach($productId);

            // Create notification
            $this->notificationService->createNotification(
                $request->user()->id,
                'operator_removed',
                'Operator Removed from Product',
                "Operator {$operator->full_name} has been removed from the product.",
                '/vendor/operators',
                'low',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Operator removed from product successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove operator from product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get operator availability
     */
    public function availability($operatorId, Request $request)
    {
        try {
            $operator = Operator::findOrFail($operatorId);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view this operator\'s availability'
                ], 403);
            }

            $startDate = $request->start_date ?? now()->toDateString();
            $endDate = $request->end_date ?? now()->addDays(30)->toDateString();

            $availability = OperatorAvailability::where('operator_id', $operatorId)
                ->whereBetween('date', [$startDate, $endDate])
                ->orderBy('date')
                ->get();

            // Get bookings for this period
            $bookings = $operator->bookings()
                ->whereIn('status', ['confirmed', 'active'])
                ->whereBetween('start_date', [$startDate, $endDate])
                ->get();

            return response()->json([
                'success' => true,
                'availability' => $availability,
                'bookings' => $bookings,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get operator availability',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update operator availability for a specific date
     */
    public function updateAvailability(Request $request, $operatorId)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'status' => 'required|in:available,booked,unavailable,holiday',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = Operator::findOrFail($operatorId);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this operator\'s availability'
                ], 403);
            }

            $availability = OperatorAvailability::updateOrCreate(
                [
                    'operator_id' => $operatorId,
                    'date' => $request->date,
                ],
                [
                    'status' => $request->status,
                    'notes' => $request->notes,
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'Availability updated successfully',
                'availability' => $availability,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update availability',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update operator status
     */
    public function updateStatus(Request $request, $operatorId)
    {
        $validator = Validator::make($request->all(), [
            'available_status' => 'required|in:available,busy,on_leave,unavailable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = Operator::findOrFail($operatorId);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this operator\'s status'
                ], 403);
            }

            $operator->update([
                'available_status' => $request->available_status,
            ]);

            // Create notification
            $this->notificationService->createNotification(
                $request->user()->id,
                'operator_status_updated',
                'Operator Status Updated',
                "Operator {$operator->full_name} is now {$request->available_status}.",
                "/vendor/operators/{$operator->id}",
                'medium',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Operator status updated successfully',
                'operator' => $operator,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update operator status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get operator statistics
     */
    public function stats($operatorId, Request $request)
    {
        try {
            $operator = Operator::findOrFail($operatorId);

            // Check if vendor owns this operator
            if ($operator->vendor_id !== $request->user()->vendorProfile->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to view this operator\'s stats'
                ], 403);
            }

            $stats = [
                'total_assignments' => $operator->total_assignments,
                'total_reviews' => $operator->total_reviews,
                'rating' => $operator->rating,
                'experience_years' => $operator->experience_years,
                'upcoming_bookings' => $operator->bookings()
                    ->whereIn('status', ['confirmed', 'active'])
                    ->where('start_date', '>=', now())
                    ->count(),
                'completed_bookings' => $operator->bookings()
                    ->where('status', 'completed')
                    ->count(),
                'total_earnings' => $operator->bookings()
                    ->where('status', 'completed')
                    ->sum('operator_charge'),
                'average_booking_value' => $operator->bookings()
                    ->where('status', 'completed')
                    ->avg('operator_charge') ?? 0,
                'current_status' => $operator->available_status,
            ];

            // Get recent assignments
            $recentAssignments = $operator->bookings()
                ->with(['product', 'customer'])
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            return response()->json([
                'success' => true,
                'stats' => $stats,
                'recent_assignments' => $recentAssignments,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get operator statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get operator performance (Admin only)
     */
    public function performance(Request $request)
    {
        try {
            $query = Operator::with(['vendor'])
                ->where('is_active', true);

            // Filter by vendor
            if ($request->vendor_id) {
                $query->where('vendor_id', $request->vendor_id);
            }

            // Filter by verification status
            if ($request->verification_status) {
                $query->where('verification_status', $request->verification_status);
            }

            $operators = $query->get();

            $performance = $operators->map(function ($operator) {
                return [
                    'id' => $operator->id,
                    'name' => $operator->full_name,
                    'vendor' => $operator->vendor->business_name,
                    'rating' => $operator->rating,
                    'total_assignments' => $operator->total_assignments,
                    'completion_rate' => $this->calculateOperatorCompletionRate($operator->id),
                    'average_rating' => $operator->rating,
                    'status' => $operator->available_status,
                    'verification_status' => $operator->verification_status,
                ];
            });

            return response()->json([
                'success' => true,
                'performance' => $performance,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get operator performance',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Calculate operator completion rate
     */
    private function calculateOperatorCompletionRate($operatorId): float
    {
        $totalAssignments = \App\Models\Booking::where('operator_id', $operatorId)->count();
        $completedAssignments = \App\Models\Booking::where('operator_id', $operatorId)
            ->where('status', 'completed')
            ->count();

        if ($totalAssignments == 0) {
            return 0;
        }

        return round(($completedAssignments / $totalAssignments) * 100, 2);
    }

    /**
     * Verify operator (Admin only)
     */
    public function verify($operatorId, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:verified,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $operator = Operator::findOrFail($operatorId);

            $operator->update([
                'verification_status' => $request->status,
                'verified_by' => $request->user()->id,
                'verified_at' => now(),
                'is_verified' => $request->status === 'verified',
            ]);

            // Create notification for vendor
            $this->notificationService->createNotification(
                $operator->vendor->user_id,
                $request->status === 'verified' ? 'operator_verified' : 'operator_rejected',
                $request->status === 'verified' ? 'Operator Verified' : 'Operator Rejected',
                $request->status === 'verified' 
                    ? "Operator {$operator->full_name} has been verified."
                    : "Operator {$operator->full_name} has been rejected. Reason: {$request->notes}",
                "/vendor/operators/{$operator->id}",
                'high',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => "Operator {$request->status} successfully",
                'operator' => $operator,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to verify operator',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}