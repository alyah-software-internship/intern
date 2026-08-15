<?php

namespace App\Repositories;

use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Collection;

class VendorRepository extends BaseRepository
{
    public function __construct(VendorProfile $model)
    {
        parent::__construct($model);
    }

    /**
     * Get vendor by user ID
     */
    public function findByUserId(int $userId): ?VendorProfile
    {
        return $this->model->where('user_id', $userId)->first();
    }

    /**
     * Get verified vendors
     */
    public function getVerifiedVendors(): Collection
    {
        return $this->model->where('verification_status', 'approved')->get();
    }

    /**
     * Get pending vendors
     */
    public function getPendingVendors(): Collection
    {
        return $this->model->where('verification_status', 'pending')->get();
    }

    /**
     * Get active vendors
     */
    public function getActiveVendors(): Collection
    {
        return $this->model->where('is_active', true)->get();
    }

    /**
     * Get featured vendors
     */
    public function getFeaturedVendors(): Collection
    {
        return $this->model->where('is_featured', true)->get();
    }

    /**
     * Get vendor with products
     */
    public function getWithProducts(int $vendorId): ?VendorProfile
    {
        return $this->model->with(['products', 'user'])->find($vendorId);
    }

    /**
     * Update vendor rating
     */
    public function updateRating(int $vendorId): VendorProfile
    {
        $vendor = $this->findOrFail($vendorId);
        $rating = $vendor->reviews()->avg('rating') ?? 0;
        $totalReviews = $vendor->reviews()->count();
        
        $vendor->update([
            'rating' => $rating,
            'total_reviews' => $totalReviews,
        ]);
        
        return $vendor;
    }

    /**
     * Search vendors by business name
     */
    public function searchByName(string $search): Collection
    {
        return $this->model->where('business_name', 'LIKE', "%{$search}%")
            ->orWhere('business_name_am', 'LIKE', "%{$search}%")
            ->get();
    }
}