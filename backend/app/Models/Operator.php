<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Operator extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'user_id',
        'full_name',
        'full_name_am',
        'phone',
        'email',
        'address',
        'specialization',
        'specialization_am',
        'experience_years',
        'hourly_rate',
        'daily_rate',
        'weekly_rate',
        'monthly_rate',
        'is_active',
        'is_verified',
        'verification_status',
        'verified_by',
        'verified_at',
        'certification_url',
        'id_document_url',
        'profile_image_url',
        'bio',
        'rating',
        'total_reviews',
        'total_assignments',
        'available_status',
    ];

    protected $casts = [
        'experience_years' => 'integer',
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'weekly_rate' => 'decimal:2',
        'monthly_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'total_reviews' => 'integer',
        'total_assignments' => 'integer',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function vendor()
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availability()
    {
        return $this->hasMany(OperatorAvailability::class);
    }

    public function productAssignments()
    {
        return $this->hasMany(ProductOperatorAssignment::class);
    }

    public function assignedProducts()
    {
        return $this->belongsToMany(Product::class, 'product_operator_assignments')
                    ->withPivot('is_primary', 'is_active')
                    ->withTimestamps();
    }

    // ========== SCOPES ==========
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'verified');
    }

    public function scopeAvailable($query)
    {
        return $query->where('available_status', 'available');
    }

    public function scopeByVendor($query, $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    public function scopeBySpecialization($query, $specialization)
    {
        return $query->where('specialization', 'LIKE', "%{$specialization}%");
    }

    // ========== ACCESSORS ==========
    public function getDisplayNameAttribute()
    {
        return $this->full_name_am ?? $this->full_name;
    }

    public function getAvailableStatusLabelAttribute()
    {
        $statuses = [
            'available' => 'Available',
            'busy' => 'Busy',
            'on_leave' => 'On Leave',
            'unavailable' => 'Unavailable',
        ];
        return $statuses[$this->available_status] ?? $this->available_status;
    }

    public function getVerificationStatusLabelAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'verified' => 'Verified',
            'rejected' => 'Rejected',
        ];
        return $statuses[$this->verification_status] ?? $this->verification_status;
    }

    public function getRateForModelAttribute($model)
    {
        $rates = [
            'hourly' => $this->hourly_rate,
            'daily' => $this->daily_rate,
            'weekly' => $this->weekly_rate,
            'monthly' => $this->monthly_rate,
        ];
        return $rates[$model] ?? $this->daily_rate;
    }

    // ========== HELPERS ==========
    public function isAvailable()
    {
        return $this->available_status === 'available' && $this->is_active;
    }

    public function isVerified()
    {
        return $this->verification_status === 'verified';
    }

    public function isBusy()
    {
        return $this->available_status === 'busy';
    }

    public function updateRating()
    {
        $this->update([
            'rating' => $this->bookings()->avg('rating') ?? 0,
            'total_reviews' => $this->bookings()->count(),
        ]);
    }

    public function getRate($unit = 'daily')
    {
        $rates = [
            'hourly' => $this->hourly_rate,
            'daily' => $this->daily_rate,
            'weekly' => $this->weekly_rate,
            'monthly' => $this->monthly_rate,
        ];
        return $rates[$unit] ?? $this->daily_rate;
    }

    public function isAssignedToProduct($productId)
    {
        return $this->assignedProducts()->where('product_id', $productId)->exists();
    }

    public function getCurrentBookings()
    {
        return $this->bookings()->whereIn('status', ['confirmed', 'active'])->get();
    }
}