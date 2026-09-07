<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductImage;
use App\Services\ProductService;
use App\Services\VendorService;
use App\Services\MediaStorageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    protected $productService;
    protected $vendorService;
    protected $mediaStorage;

    public function __construct(
        ProductService $productService,
        VendorService $vendorService,
        MediaStorageService $mediaStorage
    ) {
        $this->productService = $productService;
        $this->vendorService = $vendorService;
        $this->mediaStorage = $mediaStorage;
    }

    /**
     * Get all products with filters
     */
    public function index(Request $request)
    {
        try {
            $filters = $request->only([
                'category', 'vendor', 'availability', 
                'min_price', 'max_price', 'search',
                'sort_by', 'sort_order', 'per_page'
            ]);

            $products = $this->productService->getProducts($filters);

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get product details
     */
    public function show($id)
    {
        try {
            $product = $this->productService->getProduct($id);

            if (!$product) {
                return response()->json([
                    'success' => false,
                    'message' => 'Product not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'product' => $product,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get product details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create new product (Vendor only)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string',
            'pricing_model' => 'required|in:hourly,daily,weekly,monthly,flexible',
            'price_daily' => 'required|numeric|min:0',
            'price_hourly' => 'nullable|numeric|min:0',
            'price_weekly' => 'nullable|numeric|min:0',
            'price_monthly' => 'nullable|numeric|min:0',
            'security_deposit_amount' => 'nullable|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'delivery_available' => 'boolean',
            'operator_required' => 'boolean',
            'availability_status' => 'nullable|in:available,unavailable,booked,maintenance',
            'images' => 'nullable|array|max:4',
            'images.*' => 'image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = $this->vendorService->getVendorByUserId($request->user()->id);
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            if ($vendor->subscription_status !== 'active' || !$vendor->subscription_expires_at?->isFuture()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An active subscription is required before posting products.',
                ], 403);
            }

            $product = $this->productService->createProduct(
                $vendor->id,
                $request->all()
            );

            foreach ($request->file('images', []) as $sortOrder => $image) {
                $imageUrl = $this->mediaStorage->uploadImage($image, 'products');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageUrl,
                    'alt_text' => $request->input('name'),
                    'is_primary' => $sortOrder === 0,
                    'sort_order' => $sortOrder,
                ]);
            }

            $product->load(['vendor', 'category', 'images']);

            return response()->json([
                'success' => true,
                'message' => 'Product created successfully',
                'product' => $product,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product (Vendor only)
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'sometimes|string',
            'name_am' => 'sometimes|nullable|string|max:255',
            'description_am' => 'sometimes|nullable|string',
            'pricing_model' => 'sometimes|in:hourly,daily,weekly,monthly,flexible',
            'price_daily' => 'sometimes|numeric|min:0',
            'price_hourly' => 'sometimes|numeric|min:0',
            'price_monthly' => 'sometimes|numeric|min:0',
            'security_deposit_amount' => 'nullable|numeric|min:0',
            'quantity' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:active,inactive,pending,suspended',
            'availability_status' => 'sometimes|in:available,unavailable,booked,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = $this->productService->updateProduct($id, $request->all());

            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully',
                'product' => $product,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete product (Vendor only)
     */
    public function destroy($id)
    {
        try {
            $this->productService->deleteProduct($id);

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete product',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get featured products
     */
    public function featured(Request $request)
    {
        try {
            $limit = $request->limit ?? 6;
            $products = $this->productService->getFeaturedProducts($limit);

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get featured products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get related products
     */
    public function related($id, Request $request)
    {
        try {
            $limit = $request->limit ?? 4;
            $products = $this->productService->getRelatedProducts($id, $limit);

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get related products',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search products
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Search query is required',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $query = $request->input('query', '');
            $products = $this->productService->searchProducts((string) $query);

            return response()->json([
                'success' => true,
                'products' => $products,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}