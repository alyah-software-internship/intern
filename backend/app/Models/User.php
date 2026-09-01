<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'users';

    protected $fillable = [
        'email',
        'password',
        'first_name',
        'middle_name',
        'last_name',
        'first_name_am',
        'middle_name_am',
        'last_name_am',
        'phone',
        'phone_verified_at',
        'email_verified_at',
        'avatar_url',
        'role',
        'is_active',
        'is_banned',
        'banned_reason',
        'banned_at',
        'last_login_at',
        'last_login_ip',
        'login_attempts',
        'locked_until',
        'remember_token',
        'preferred_language',
        'preferred_currency',
        'timezone',
        'bio',
        'bio_am',
        'professional_title',
        'experience_years',
        'professional_bio',
        'skills',
        'cv_url',
        'date_of_birth',
        'gender',
        'address',
        'address_am',
        'city',
        'city_am',
        'country',
        'postal_code',
        'referral_code',
        'referred_by',
        'trust_score',
        'total_spent',
        'notification_preferences',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'full_name',
        'full_name_am',
        'display_name',
        'initials',
        'flags',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'phone_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'banned_at' => 'datetime',
        'locked_until' => 'datetime',
        'is_active' => 'boolean',
        'is_banned' => 'boolean',
        'notification_preferences' => 'array',
        'experience_years' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ========== ACCESSORS ==========
    
    public function getFullNameAttribute()
    {
        return trim($this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name);
    }

    public function getFullNameAmAttribute()
    {
        return trim($this->first_name_am . ' ' . $this->middle_name_am . ' ' . $this->last_name_am);
    }

    public function getDisplayNameAttribute()
    {
        if ($this->preferred_language === 'am' && $this->full_name_am) {
            return $this->full_name_am;
        }
        return $this->full_name;
    }

    public function getInitialsAttribute()
    {
        return strtoupper(
            substr($this->first_name ?? '', 0, 1) .
            substr($this->middle_name ?? '', 0, 1) .
            substr($this->last_name ?? '', 0, 1)
        );
    }

    public function getFlagsAttribute()
    {
        if ($this->is_banned) {
            $label = 'Banned';
        } elseif ($this->is_active) {
            $label = 'Active';
        } else {
            $label = 'Inactive';
        }

        return [
            'active' => (bool) $this->is_active,
            'banned' => (bool) $this->is_banned,
            'label' => $label,
        ];
    }

    // ========== MUTATORS ==========
    
    public function setPasswordAttribute($value)
    {
        $this->attributes['password'] = bcrypt($value);
    }

    // ========== RELATIONSHIPS ==========
    
    public function vendorProfile()
    {
        return $this->hasOne(VendorProfile::class, 'user_id');
    }

    public function operator()
    {
        return $this->hasOne(Operator::class, 'user_id');
    }

    public function wallet()
    {
        return $this->hasOne(Wallet::class, 'user_id');
    }

    public function vendorPayouts()
    {
        return $this->hasManyThrough(
            VendorPayout::class,
            VendorProfile::class,
            'user_id',
            'vendor_id',
            'id',
            'id'
        );
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class, 'customer_id');
    }

    public function vendorBookings()
    {
        return $this->hasMany(Booking::class, 'vendor_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'customer_id');
    }

    public function vendorReviews()
    {
        return $this->hasMany(Review::class, 'vendor_id');
    }

    public function wishlist()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function referredBy()
    {
        return $this->belongsTo(User::class, 'referred_by');
    }

    public function referrals()
    {
        return $this->hasMany(User::class, 'referred_by');
    }

    public function identityDocuments()
    {
        return $this->hasMany(IdentityDocument::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }

    public function securityDeposits()
    {
        return $this->hasMany(SecurityDeposit::class, 'customer_id');
    }

    // ========== SCOPES ==========
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeVendors($query)
    {
        return $query->where('role', 'vendor');
    }

    public function scopeCustomers($query)
    {
        return $query->where('role', 'customer');
    }

    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    // ========== HELPERS ==========
    
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isVendor()
    {
        return $this->role === 'vendor';
    }

    public function isCustomer()
    {
        return $this->role === 'customer';
    }

    public function isOperator()
    {
        return $this->role === 'operator';
    }

    public function isActive()
    {
        return $this->is_active && !$this->is_banned;
    }
}