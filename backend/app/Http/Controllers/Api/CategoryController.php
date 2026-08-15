<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * Get all categories
     */
    public function index(Request $request)
    {
        try {
            $categories = Category::withCount('products')
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get();

            return response()->json([
                'success' => true,
                'categories' => $categories,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get products by category
     */
    public function products($categoryId, Request $request)
    {
        try {
            $category = Category::findOrFail($categoryId);
            
            $products = Product::where('category_id', $categoryId)
                ->where('status', 'active')
                ->with(['vendor', 'images'])
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'category' => $category,
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get category products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get category details
     */
    public function show($id)
    {
        try {
            $category = Category::withCount('products')->findOrFail($id);

            return response()->json([
                'success' => true,
                'category' => $category,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get category details',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}