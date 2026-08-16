<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Get all categories (Public)
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
     * Get category details (Public)
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

    /**
     * Get products by category (Public)
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

    // ============================================================
    // ADMIN METHODS (Requires Admin Authentication)
    // ============================================================

    /**
     * Create a new category (Admin Only)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'name_am' => 'nullable|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug',
            'image_url' => 'nullable|string|max:500',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $category = Category::create([
                'name' => $request->name,
                'name_am' => $request->name_am,
                'slug' => Str::slug($request->slug),
                'image_url' => $request->image_url,
                'parent_id' => $request->parent_id,
                'is_active' => $request->is_active ?? true,
                'sort_order' => $request->sort_order ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'category' => $category,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a category (Admin Only)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'name_am' => 'nullable|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:categories,slug,' . $id,
            'image_url' => 'nullable|string|max:500',
            'parent_id' => 'nullable|exists:categories,id',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $category = Category::findOrFail($id);
            
            $data = $request->all();
            if (isset($data['slug'])) {
                $data['slug'] = Str::slug($data['slug']);
            }
            
            $category->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'category' => $category,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a category (Admin Only)
     */
    public function destroy($id)
    {
        try {
            $category = Category::findOrFail($id);
            
            // Check if category has products
            if ($category->products()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with associated products. Please reassign or delete the products first.',
                ], 400);
            }
            
            // Check if category has children
            if ($category->children()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with sub-categories. Please delete or reassign the sub-categories first.',
                ], 400);
            }
            
            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all categories with sub-categories (Admin Only)
     */
    public function all(Request $request)
    {
        try {
            $categories = Category::with(['children', 'children.products'])
                ->whereNull('parent_id')
                ->orderBy('sort_order')
                ->get();

            return response()->json([
                'success' => true,
                'categories' => $categories,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get all categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle category active status (Admin Only)
     */
    public function toggleActive($id)
    {
        try {
            $category = Category::findOrFail($id);
            $category->update([
                'is_active' => !$category->is_active
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category status updated successfully',
                'category' => $category,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reorder categories (Admin Only)
     */
    public function reorder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.sort_order' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            foreach ($request->categories as $categoryData) {
                Category::where('id', $categoryData['id'])->update([
                    'sort_order' => $categoryData['sort_order']
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Categories reordered successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reorder categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}