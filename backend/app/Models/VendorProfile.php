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
        'verification_notes',
        'identity_verified',
        'identity_verified_at',
        'verification_approved_at',
        'verified_at',
        'payment_methods_verified',
        'is_active',
        'suspension_reason',
        'suspended_at',
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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
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
        // ✅ Explicitly specify the foreign key
        return $this->hasMany(VendorPaymentMethod::class, 'vendor_id');
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

    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // ========== ACCESSORS ==========
    
    public function getDisplayNameAttribute()
    {
        return $this->business_name_am ?? $this->business_name;
    }

    public function getVerificationStatusLabelAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'under_review' => 'Under Review',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'suspended' => 'Suspended',
        ];
        return $statuses[$this->verification_status] ?? $this->verification_status;
    }

    // ========== HELPERS ==========
    
    public function isVerified()
    {
        return $this->verification_status === 'approved';
    }

    public function isPending()
    {
        return $this->verification_status === 'pending';
    }

    public function isActive()
    {
        return $this->is_active && $this->isVerified();
    }

    public function calculateRating()
    {
        return $this->reviews()->avg('rating') ?? 0;
    }

    public function updateRating()
    {
        $this->update([
            'rating' => $this->calculateRating(),
            'total_reviews' => $this->reviews()->count(),
        ]);
    }
}