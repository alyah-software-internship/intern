<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'booking_id',
        'product_id',
        'customer_id',
        'vendor_id',
        'rating',
        'title',
        'comment',
        'comment_am',
        'images',
        'is_verified_purchase',
        'is_approved',
        'reported_count',
    ];

    protected $casts = [
        'rating' => 'integer',
        'is_verified_purchase' => 'boolean',
        'is_approved' => 'boolean',
        'reported_count' => 'integer',
        'images' => 'array',
    ];

    // ========== RELATIONSHIPS ==========
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function vendor()
    {
        return $this->belongsTo(VendorProfile::class, 'vendor_id');
    }

    // ========== SCOPES ==========
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeHighRated($query)
    {
        return $query->where('rating', '>=', 4);
    }
}