<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Wishlist;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WishlistController extends Controller
{
    /**
     * Get user's wishlist
     */
    public function index(Request $request)
    {
        try {
            $wishlist = Wishlist::with(['product', 'product.vendor', 'product.images'])
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'wishlist' => $wishlist,
                'count' => $wishlist->count(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add product to wishlist
     */
    public function add(Request $request, $productId)
    {
        try {
            // Check if product exists
            $product = Product::find($productId);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            // Check if already in wishlist
            $exists = Wishlist::where('user_id', $request->user()->id)
                ->where('product_id', $productId)
                ->exists();

            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product already in wishlist'
                ], 400);
            }

            // Add to wishlist
            $wishlist = Wishlist::create([
                'user_id' => $request->user()->id,
                'product_id' => $productId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist',
                'wishlist' => $wishlist,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add to wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function remove(Request $request, $productId)
    {
        try {
            $wishlist = Wishlist::where('user_id', $request->user()->id)
                ->where('product_id', $productId)
                ->first();

            if (!$wishlist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found in wishlist'
                ], 404);
            }

            $wishlist->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product removed from wishlist',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove from wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle wishlist (add if not exists, remove if exists)
     */
    public function toggle(Request $request, $productId)
    {
        try {
            // Check if product exists
            $product = Product::find($productId);
            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            $wishlist = Wishlist::where('user_id', $request->user()->id)
                ->where('product_id', $productId)
                ->first();

            if ($wishlist) {
                $wishlist->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Product removed from wishlist',
                    'in_wishlist' => false,
                ]);
            }

            $wishlist = Wishlist::create([
                'user_id' => $request->user()->id,
                'product_id' => $productId,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Product added to wishlist',
                'in_wishlist' => true,
                'wishlist' => $wishlist,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to toggle wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if product is in wishlist
     */
    public function check(Request $request, $productId)
    {
        try {
            $exists = Wishlist::where('user_id', $request->user()->id)
                ->where('product_id', $productId)
                ->exists();

            return response()->json([
                'success' => true,
                'in_wishlist' => $exists,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to check wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all wishlist items
     */
    public function clear(Request $request)
    {
        try {
            Wishlist::where('user_id', $request->user()->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Wishlist cleared successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear wishlist',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}