<?php

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class ProductRepository extends BaseRepository
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    /**
     * Get products by vendor
     */
    public function findByVendor(int $vendorId): Collection
    {
        return $this->model->where('vendor_id', $vendorId)->get();
    }

    /**
     * Get products by category
     */
    public function findByCategory(int $categoryId): Collection
    {
        return $this->model->where('category_id', $categoryId)->get();
    }

    /**
     * Get available products
     */
    public function getAvailableProducts(): Collection
    {
        return $this->model->where('availability_status', 'available')
            ->where('status', 'active')
            ->get();
    }

    /**
     * Get featured products
     */
    public function getFeaturedProducts(int $limit = 6): Collection
    {
        return $this->model->where('is_featured', true)
            ->where('status', 'active')
            ->limit($limit)
            ->get();
    }

    /**
     * Search products
     */
    public function search(string $query): Collection
    {
        return $this->model->where('name', 'LIKE', "%{$query}%")
            ->orWhere('name_am', 'LIKE', "%{$query}%")
            ->orWhere('description', 'LIKE', "%{$query}%")
            ->orWhere('description_am', 'LIKE', "%{$query}%")
            ->get();
    }

    /**
     * Get products by price range
     */
    public function getByPriceRange(float $min, float $max): Collection
    {
        return $this->model->whereBetween('price_daily', [$min, $max])->get();
    }

    /**
     * Get products with filters
     */
    public function getWithFilters(array $filters): Collection
    {
        $query = $this->model->where('status', 'active');

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (isset($filters['availability_status'])) {
            $query->where('availability_status', $filters['availability_status']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price_daily', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price_daily', '<=', $filters['max_price']);
        }

        return $query->get();
    }
}