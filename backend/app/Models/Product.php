<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'category_id',
        'name',
        'name_am',
        'slug',
        'description',
        'description_am',
        'pricing_model',
        'price_hourly',
        'price_daily',
        'price_weekly',
        'price_monthly',
        'price_flexible',
        'security_deposit_type',
        'security_deposit_amount',
        'security_deposit_percentage',
        'security_deposit_held',
        'security_deposit_refund_days',
        'operator_required',
        'operator_included',
        'operator_charge_type',
        'operator_charge_amount',
        'quantity',
        'status',
        'availability_status',
        'is_featured',
        'views_count',
        'rating',
        'total_reviews',
        'specifications',
        'rental_policies',
        'delivery_available',
    ];

    protected $casts = [
        'security_deposit_held' => 'boolean',
        'operator_required' => 'boolean',
        'operator_included' => 'boolean',
        'is_featured' => 'boolean',
        'delivery_available' => 'boolean',
        'price_hourly' => 'decimal:2',
        'price_daily' => 'decimal:2',
        'price_weekly' => 'decimal:2',
        'price_monthly' => 'decimal:2',
        'price_flexible' => 'decimal:2',
        'security_deposit_amount' => 'decimal:2',
        'security_deposit_percentage' => 'decimal:2',
        'operator_charge_amount' => 'decimal:2',
        'rating' => 'decimal:2',
        'views_count' => 'integer',
        'total_reviews' => 'integer',
        'quantity' => 'integer',
        'specifications' => 'array',
        'rental_policies' => 'array',
    ];

    // ========== RELATIONSHIPS ==========
    public function vendor()
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function operatorAssignments()
    {
        return $this->hasMany(ProductOperatorAssignment::class);
    }

    public function assignedOperators()
    {
        return $this->belongsToMany(Operator::class, 'product_operator_assignments')
                    ->withPivot('is_primary', 'is_active')
                    ->withTimestamps();
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    // ========== SCOPES ==========
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeAvailable($query)
    {
        return $query->where('availability_status', 'available');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // ========== HELPERS ==========
    public function isAvailable()
    {
        return $this->availability_status === 'available' && $this->status === 'active';
    }

    public function getPriceAttribute()
    {
        return $this->{'price_' . $this->pricing_model} ?? $this->price_daily;
    }

    public function getDisplayNameAttribute()
    {
        return $this->name_am ?? $this->name;
    }
}