<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ProductService
{
    /**
     * Get all products with filters
     */
    public function getProducts(array $filters = [])
    {
        $query = Product::with(['vendor', 'category', 'images'])
            ->where('status', 'active');

        // Apply filters
        if (isset($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (isset($filters['vendor'])) {
            $query->where('vendor_id', $filters['vendor']);
        }

        if (isset($filters['availability'])) {
            $query->where('availability_status', $filters['availability']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price_daily', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price_daily', '<=', $filters['max_price']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('name_am', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhere('description_am', 'LIKE', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($filters['per_page'] ?? 20);
    }

    /**
     * Get product details
     */
    public function getProduct($id)
    {
        $product = Product::with([
            'vendor',
            'category',
            'images',
            'reviews' => function ($query) {
                $query->approved()->latest();
            },
            'assignedOperators'
        ])->find($id);

        if ($product) {
            // Increment views
            $product->increment('views_count');
        }

        return $product;
    }

    /**
     * Create product
     */
    public function createProduct($vendorId, array $data)
    {
        $data['slug'] = $this->generateSlug($data['name']);
        $data['vendor_id'] = $vendorId;

        $product = Product::create($data);

        // Handle images if provided
        if (isset($data['images']) && is_array($data['images'])) {
            $this->uploadImages($product->id, $data['images']);
        }

        return $product;
    }

    /**
     * Update product
     */
    public function updateProduct($id, array $data)
    {
        $product = Product::find($id);

        if (isset($data['name']) && $data['name'] !== $product->name) {
            $data['slug'] = $this->generateSlug($data['name']);
        }

        $product->update($data);

        // Handle images if provided
        if (isset($data['images']) && is_array($data['images'])) {
            $this->uploadImages($product->id, $data['images']);
        }

        return $product;
    }

    /**
     * Delete product
     */
    public function deleteProduct($id)
    {
        $product = Product::find($id);
        
        // Delete associated images
        foreach ($product->images as $image) {
            Storage::delete('public/products/' . basename($image->image_url));
            $image->delete();
        }

        $product->delete();
        return true;
    }

    /**
     * Upload product images
     */
    public function uploadImages($productId, array $images)
    {
        foreach ($images as $index => $image) {
            $path = $image->store('public/products');
            $url = Storage::url($path);

            ProductImage::create([
                'product_id' => $productId,
                'image_url' => $url,
                'is_primary' => $index === 0,
                'sort_order' => $index,
            ]);
        }
    }

    /**
     * Set primary image
     */
    public function setPrimaryImage($imageId)
    {
        $image = ProductImage::find($imageId);
        
        // Reset all images for this product
        ProductImage::where('product_id', $image->product_id)
            ->update(['is_primary' => false]);
        
        // Set this as primary
        $image->update(['is_primary' => true]);
        
        return $image;
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts($limit = 6)
    {
        return Product::with(['vendor', 'images'])
            ->where('is_featured', true)
            ->where('status', 'active')
            ->where('availability_status', 'available')
            ->limit($limit)
            ->get();
    }

    /**
     * Get related products
     */
    public function getRelatedProducts($productId, $limit = 4)
    {
        $product = Product::find($productId);
        
        return Product::with(['vendor', 'images'])
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $productId)
            ->where('status', 'active')
            ->limit($limit)
            ->get();
    }

    /**
     * Generate slug
     */
    private function generateSlug($name)
    {
        $slug = Str::slug($name);
        
        // Ensure uniqueness
        $count = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = Str::slug($name) . '-' . $count++;
        }
        
        return $slug;
    }

    /**
     * Update product rating
     */
    public function updateRating($productId)
    {
        $product = Product::find($productId);
        $product->update([
            'rating' => $product->reviews()->approved()->avg('rating') ?? 0,
            'total_reviews' => $product->reviews()->approved()->count(),
        ]);
    }
}
