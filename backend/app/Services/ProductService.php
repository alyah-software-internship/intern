<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\VendorProfile;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Collection;

class ProductService
{
    /**
     * Get products with filters.
     */
    public function getProducts(array $filters = [])
    {
        $query = Product::with(['vendor', 'category', 'images'])
            ->where('status', 'active');

        if (!empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (!empty($filters['vendor'])) {
            $query->where('vendor_id', $filters['vendor']);
        }

        if (!empty($filters['availability'])) {
            $query->where('availability_status', $filters['availability']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price_daily', '>=', (float) $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price_daily', '<=', (float) $filters['max_price']);
        }

        if (!empty($filters['search'])) {
            $search = trim($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('name_am', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('description_am', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $startDate = $filters['start_date'];
            $endDate = $filters['end_date'];

            $query->whereDoesntHave('bookings', function ($bookingQuery) use ($startDate, $endDate) {
                $bookingQuery
                    ->whereNotIn('status', ['cancelled', 'rejected'])
                    ->where('start_date', '<', $endDate)
                    ->where('end_date', '>', $startDate);
            });
        }

        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = strtolower($filters['sort_order'] ?? 'desc') === 'asc' ? 'asc' : 'desc';

        $allowedSorts = ['created_at', 'price_daily', 'rating', 'views_count', 'name'];
        if (!in_array($sortBy, $allowedSorts, true)) {
            $sortBy = 'created_at';
        }

        $query->orderBy($sortBy, $sortOrder);

        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 15;
        $perPage = $perPage > 0 ? $perPage : 15;

        return $query->paginate($perPage);
    }

    /**
     * Get product details by id.
     */
    public function getProduct($id): ?Product
    {
        return Product::with(['vendor', 'category', 'images', 'reviews.customer'])
            ->where('id', $id)
            ->first();
    }

    /**
     * Create a new product for a vendor.
     */
    public function createProduct(int $vendorId, array $data): Product
    {
        $payload = [
            'vendor_id' => $vendorId,
            'category_id' => $data['category_id'] ?? null,
            'name' => $data['name'],
            'name_am' => $data['name_am'] ?? null,
            'description' => $data['description'] ?? null,
            'description_am' => $data['description_am'] ?? null,
            'pricing_model' => $data['pricing_model'] ?? 'daily',
            'price_hourly' => $data['price_hourly'] ?? 0,
            'price_daily' => $data['price_daily'] ?? 0,
            'price_weekly' => $data['price_weekly'] ?? 0,
            'price_monthly' => $data['price_monthly'] ?? 0,
            'security_deposit_type' => $data['security_deposit_type'] ?? 'fixed',
            'security_deposit_amount' => $data['security_deposit_amount'] ?? 0,
            'security_deposit_percentage' => $data['security_deposit_percentage'] ?? 0,
            'quantity' => $data['quantity'] ?? 1,
            'status' => $data['status'] ?? 'active',
            'availability_status' => $data['availability_status'] ?? 'available',
            'delivery_available' => $data['delivery_available'] ?? false,
            'rental_policies' => $data['rental_policies'] ?? null,
            'operator_required' => $data['operator_required'] ?? false,
            'operator_included' => $data['operator_included'] ?? false,
            'operator_charge_type' => $data['operator_charge_type'] ?? 'fixed',
            'operator_charge_amount' => $data['operator_charge_amount'] ?? 0,
            'is_featured' => $data['is_featured'] ?? false,
            'slug' => Str::slug($data['name']) . '-' . uniqid(),
        ];

        $product = Product::create($payload);

        return $product->fresh(['vendor', 'category', 'images']);
    }

    /**
     * Update product details.
     */
    public function updateProduct(int $productId, array $data): Product
    {
        $product = Product::findOrFail($productId);

        if (isset($data['name']) && !empty($data['name'])) {
            $data['slug'] = Str::slug($data['name']) . '-' . $product->id;
        }

        $product->fill($data);
        $product->save();

        return $product->fresh(['vendor', 'category', 'images']);
    }

    /**
     * Delete a product.
     */
    public function deleteProduct(int $productId): bool
    {
        $product = Product::findOrFail($productId);
        $product->delete();

        return true;
    }

    /**
     * Get featured products.
     */
    public function getFeaturedProducts(int $limit = 6): Collection
    {
        return Product::with([
            'vendor',
            'category',
            'images' => fn ($query) => $query
                ->orderByDesc('is_primary')
                ->orderBy('sort_order'),
        ])
            ->where('status', 'active')
            ->orderBy('is_featured', 'desc')
            ->orderBy('rating', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get related products for the given product.
     */
    public function getRelatedProducts(int $productId, int $limit = 4): Collection
    {
        $product = Product::findOrFail($productId);

        return Product::with(['vendor', 'category', 'images'])
            ->where('status', 'active')
            ->where('category_id', $product->category_id)
            ->where('id', '!=', $productId)
            ->orderBy('rating', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Search products by name or description (multi-language)
     */
    public function searchProducts(string $query): Collection
    {
        return Product::with(['vendor', 'category', 'images'])
            ->where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('name_am', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%")
                  ->orWhere('description_am', 'LIKE', "%{$query}%");
            })
            ->orderBy('rating', 'desc')
            ->limit(20)
            ->get();
    }

    /**
     * Get vendor products (for vendor dashboard)
     */
    public function getVendorProducts(int $vendorId): Collection
    {
        return Product::with(['category', 'images'])
            ->where('vendor_id', $vendorId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get product by slug
     */
    public function getProductBySlug(string $slug): ?Product
    {
        return Product::with(['vendor', 'category', 'images', 'reviews'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }

    /**
     * Update product status
     */
    public function updateStatus(int $productId, string $status): Product
    {
        $product = Product::findOrFail($productId);
        $product->update(['status' => $status]);
        return $product;
    }

    /**
     * Update product availability
     */
    public function updateAvailability(int $productId, string $status): Product
    {
        $product = Product::findOrFail($productId);
        $product->update(['availability_status' => $status]);
        return $product;
    }

    /**
     * Toggle featured status
     */
    public function toggleFeatured(int $productId): Product
    {
        $product = Product::findOrFail($productId);
        $product->update(['is_featured' => !$product->is_featured]);
        return $product;
    }

    /**
     * Check if product is available for booking
     */
    public function isProductAvailableForBooking(int $productId, string $startDate, string $endDate): bool
    {
        $product = Product::findOrFail($productId);
        
        // Check product status
        if ($product->availability_status !== 'available' || $product->status !== 'active') {
            return false;
        }

        // Check for overlapping bookings
        $overlapping = \App\Models\Booking::where('product_id', $productId)
            ->where('status', '!=', 'cancelled')
            ->where('status', '!=', 'rejected')
            ->where(function ($query) use ($startDate, $endDate) {
                $query->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function ($q) use ($startDate, $endDate) {
                          $q->where('start_date', '<=', $startDate)
                            ->where('end_date', '>=', $endDate);
                      });
            })
            ->exists();

        return !$overlapping;
    }

    /**
     * Get product statistics
     */
    public function getProductStats(int $productId): array
    {
        $product = Product::findOrFail($productId);
        
        return [
            'views_count' => $product->views_count,
            'total_bookings' => $product->bookings()->count(),
            'completed_bookings' => $product->bookings()->where('status', 'completed')->count(),
            'active_bookings' => $product->bookings()->where('status', 'active')->count(),
            'total_reviews' => $product->reviews()->count(),
            'average_rating' => $product->reviews()->avg('rating') ?? 0,
            'revenue' => $product->bookings()->where('status', 'completed')->sum('total_amount'),
        ];
    }

    /**
     * Get popular products
     */
    public function getPopularProducts(int $limit = 10): Collection
    {
        return Product::with(['vendor', 'images'])
            ->where('status', 'active')
            ->orderBy('views_count', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get products by category
     */
    public function getProductsByCategory(int $categoryId, int $limit = 10): Collection
    {
        return Product::with(['vendor', 'images'])
            ->where('category_id', $categoryId)
            ->where('status', 'active')
            ->where('availability_status', 'available')
            ->orderBy('rating', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get products by vendor
     */
    public function getProductsByVendor(int $vendorId): Collection
    {
        return Product::with(['category', 'images'])
            ->where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get available products count for vendor
     */
    public function getAvailableProductsCount(int $vendorId): int
    {
        return Product::where('vendor_id', $vendorId)
            ->where('status', 'active')
            ->where('availability_status', 'available')
            ->count();
    }

    /**
     * Remove product image
     */
    public function removeImage(int $imageId): bool
    {
        $image = ProductImage::findOrFail($imageId);
        
        // Delete file from storage
        if (Storage::exists('public/products/' . basename($image->image_url))) {
            Storage::delete('public/products/' . basename($image->image_url));
        }
        
        // Check if this was the primary image
        $wasPrimary = $image->is_primary;
        
        $image->delete();
        
        // If this was primary, set another as primary
        if ($wasPrimary) {
            $newPrimary = ProductImage::where('product_id', $image->product_id)
                ->orderBy('sort_order')
                ->first();
            if ($newPrimary) {
                $newPrimary->update(['is_primary' => true]);
            }
        }
        
        return true;
    }

    /**
     * Reorder product images
     */
    public function reorderImages(int $productId, array $imageIds): bool
    {
        foreach ($imageIds as $index => $imageId) {
            ProductImage::where('id', $imageId)
                ->where('product_id', $productId)
                ->update(['sort_order' => $index]);
        }
        return true;
    }
}