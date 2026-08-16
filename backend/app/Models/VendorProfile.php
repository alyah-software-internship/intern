<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendorProfile extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_name_am',
        'business_type',
        'business_type_am',
        'description',
        'description_am',
        'address',
        'address_am',
        'city',
        'city_am',
        'country',
        'postal_code',
        'phone',
        'email',
        'website',
        'logo_url',
        'cover_image_url',
        'tax_id',
        'registration_number',
        'verification_status',
        'identity_verified',
        'identity_verified_at',
        'verification_approved_at',
        'payment_methods_verified',
        'is_active',
        'is_featured',
        'rating',
        'total_reviews',
        'total_bookings',
        'total_revenue',
        'pending_payouts',
        'security_deposit_held',
        'response_time_avg',
        'joined_date',
        'completed_projects',
        'trust_score',
    ];

    protected $casts = [
        'identity_verified' => 'boolean',
        'payment_methods_verified' => 'boolean',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'rating' => 'decimal:2',
        'total_revenue' => 'decimal:2',
        'pending_payouts' => 'decimal:2',
        'security_deposit_held' => 'decimal:2',
        'response_time_avg' => 'decimal:2',
        'identity_verified_at' => 'datetime',
        'verification_approved_at' => 'datetime',
        'joined_date' => 'date',
    ];

    // ========== RELATIONSHIPS ==========
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'vendor_id');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'vendor_id');
    }

    public function operators()
    {
        return $this->hasMany(Operator::class);
    }

    public function paymentMethods()
    {
        return $this->hasMany(VendorPaymentMethod::class);
    }

    public function payouts()
    {
        return $this->hasMany(VendorPayout::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'vendor_id');
    }

    public function securityDeposits()
    {
        return $this->hasMany(SecurityDeposit::class, 'vendor_id');
    }

    // ========== SCOPES ==========
    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'approved');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // ========== HELPERS ==========
    public function isVerified()
    {
        return $this->verification_status === 'approved';
    }

    public function getDisplayNameAttribute()
    {
        return $this->business_name_am ?? $this->business_name;
    }
}