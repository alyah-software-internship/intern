<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Booking;
use App\Models\Product;
use App\Models\VendorProfile;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all reviews for a product
     */
    public function productReviews($productId, Request $request)
    {
        try {
            $product = Product::findOrFail($productId);
            
            $reviews = Review::where('product_id', $productId)
                ->where('is_approved', true)
                ->with(['customer', 'vendor'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'product' => $product->name,
                'average_rating' => $product->rating,
                'total_reviews' => $product->total_reviews,
                'reviews' => $reviews,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get product reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all reviews for a vendor
     */
    public function vendorReviews($vendorId, Request $request)
    {
        try {
            $vendor = VendorProfile::findOrFail($vendorId);
            
            $reviews = Review::where('vendor_id', $vendorId)
                ->where('is_approved', true)
                ->with(['customer', 'product'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'vendor' => $vendor->business_name,
                'average_rating' => $vendor->rating,
                'total_reviews' => $vendor->total_reviews,
                'reviews' => $reviews,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get reviews by the authenticated user
     */
    public function myReviews(Request $request)
    {
        try {
            $reviews = Review::where('customer_id', $request->user()->id)
                ->with(['product', 'vendor'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'reviews' => $reviews,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get your reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new review for a completed booking
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = Booking::findOrFail($request->booking_id);
            
            // Check if booking belongs to the user
            if ($booking->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to review this booking'
                ], 403);
            }

            // Check if booking is completed
            if ($booking->status !== 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'You can only review completed bookings'
                ], 400);
            }

            // Check if review already exists
            $existingReview = Review::where('booking_id', $request->booking_id)->first();
            if ($existingReview) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already reviewed this booking'
                ], 400);
            }

            // Handle image uploads
            $imageUrls = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('public/reviews');
                    $imageUrls[] = asset('storage/' . str_replace('public/', '', $path));
                }
            }

            $review = Review::create([
                'booking_id' => $request->booking_id,
                'product_id' => $booking->product_id,
                'customer_id' => $request->user()->id,
                'vendor_id' => $booking->vendor_id,
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'comment_am' => $request->comment_am ?? null,
                'images' => !empty($imageUrls) ? $imageUrls : null,
                'is_verified_purchase' => true,
                'is_approved' => true,
            ]);

            // Update product rating
            $this->updateProductRating($booking->product_id);
            
            // Update vendor rating
            $this->updateVendorRating($booking->vendor_id);

            // Send notification to vendor
            $this->notificationService->createNotification(
                $booking->vendor->user_id,
                'new_review',
                'New Review Received',
                "You received a new {$review->rating}-star review for your product",
                "/vendor/reviews",
                'medium',
                'vendor'
            );

            return response()->json([
                'success' => true,
                'message' => 'Review submitted successfully',
                'review' => $review,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific review
     */
    public function show($id)
    {
        try {
            $review = Review::with(['customer', 'vendor', 'product', 'booking'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'review' => $review,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Review not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update a review (only if user owns it)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'sometimes|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review = Review::findOrFail($id);
            
            // Check if user owns the review
            if ($review->customer_id !== $request->user()->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to update this review'
                ], 403);
            }

            // Check if review can be edited (within 7 days)
            if ($review->created_at->diffInDays(now()) > 7) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reviews can only be edited within 7 days of submission'
                ], 400);
            }

            $review->update($request->only(['rating', 'title', 'comment', 'comment_am']));

            // Update product and vendor ratings
            $this->updateProductRating($review->product_id);
            $this->updateVendorRating($review->vendor_id);

            return response()->json([
                'success' => true,
                'message' => 'Review updated successfully',
                'review' => $review,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a review (soft delete)
     */
    public function destroy($id, Request $request)
    {
        try {
            $review = Review::findOrFail($id);
            
            // Check if user owns the review or is admin
            if ($review->customer_id !== $request->user()->id && $request->user()->role !== 'admin') {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not authorized to delete this review'
                ], 403);
            }

            // Check if review can be deleted (within 7 days for users, admin can delete anytime)
            if ($review->customer_id === $request->user()->id && 
                $review->created_at->diffInDays(now()) > 7) {
                return response()->json([
                    'success' => false,
                    'message' => 'Reviews can only be deleted within 7 days of submission'
                ], 400);
            }

            $productId = $review->product_id;
            $vendorId = $review->vendor_id;

            $review->delete();

            // Update product and vendor ratings
            $this->updateProductRating($productId);
            $this->updateVendorRating($vendorId);

            return response()->json([
                'success' => true,
                'message' => 'Review deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Report a review (for inappropriate content)
     */
    public function report($id, Request $request)
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
            $review = Review::findOrFail($id);
            $review->increment('reported_count');

            // Notify admin
            $this->notificationService->createNotification(
                1, // Admin user ID
                'review_reported',
                'Review Reported',
                "A review has been reported. Reason: {$request->reason}",
                "/admin/reviews/{$id}",
                'high',
                'system'
            );

            return response()->json([
                'success' => true,
                'message' => 'Review reported successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to report review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Approve a review (if auto-approval is disabled)
     */
    public function approve($id)
    {
        try {
            $review = Review::findOrFail($id);
            $review->update(['is_approved' => true]);

            // Update product and vendor ratings
            $this->updateProductRating($review->product_id);
            $this->updateVendorRating($review->vendor_id);

            return response()->json([
                'success' => true,
                'message' => 'Review approved successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Reject a review
     */
    public function reject($id, Request $request)
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
            $review = Review::findOrFail($id);
            $review->update([
                'is_approved' => false,
                'rejection_reason' => $request->reason,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Review rejected successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject review',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Get all reviews (with filters)
     */
    public function adminReviews(Request $request)
    {
        try {
            $query = Review::with(['customer', 'vendor', 'product']);

            if ($request->status === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->status === 'approved') {
                $query->where('is_approved', true);
            }

            if ($request->rating) {
                $query->where('rating', $request->rating);
            }

            if ($request->vendor_id) {
                $query->where('vendor_id', $request->vendor_id);
            }

            if ($request->product_id) {
                $query->where('product_id', $request->product_id);
            }

            $reviews = $query->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'reviews' => $reviews,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get reviews',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product rating
     */
    private function updateProductRating($productId)
    {
        $product = Product::find($productId);
        if ($product) {
            $rating = $product->reviews()->where('is_approved', true)->avg('rating') ?? 0;
            $totalReviews = $product->reviews()->where('is_approved', true)->count();
            
            $product->update([
                'rating' => round($rating, 2),
                'total_reviews' => $totalReviews,
            ]);
        }
    }

    /**
     * Update vendor rating
     */
    private function updateVendorRating($vendorId)
    {
        $vendor = VendorProfile::find($vendorId);
        if ($vendor) {
            $rating = $vendor->reviews()->where('is_approved', true)->avg('rating') ?? 0;
            $totalReviews = $vendor->reviews()->where('is_approved', true)->count();
            
            $vendor->update([
                'rating' => round($rating, 2),
                'total_reviews' => $totalReviews,
            ]);
        }
    }
}