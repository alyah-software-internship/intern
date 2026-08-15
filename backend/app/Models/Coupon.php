<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'description_am',
        'discount_type',
        'discount_value',
        'min_order_amount',
        'max_discount_amount',
        'start_date',
        'end_date',
        'usage_limit',
        'usage_count',
        'per_user_limit',
        'is_active',
    ];

    protected $casts = [
        'discount_value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'max_discount_amount' => 'decimal:2',
        'usage_limit' => 'integer',
        'usage_count' => 'integer',
        'per_user_limit' => 'integer',
        'is_active' => 'boolean',
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function redemptions()
    {
        return $this->hasMany(CouponRedemption::class);
    }

    // ========== SCOPES ==========
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                     ->where('start_date', '<=', now())
                     ->where('end_date', '>=', now());
    }

    public function scopeByCode($query, $code)
    {
        return $query->where('code', $code);
    }

    // ========== ACCESSORS ==========
    public function getDiscountTypeLabelAttribute()
    {
        $types = [
            'percentage' => 'Percentage',
            'fixed' => 'Fixed Amount',
        ];
        return $types[$this->discount_type] ?? $this->discount_type;
    }

    public function getIsValidAttribute()
    {
        return $this->is_active 
            && $this->start_date <= now() 
            && $this->end_date >= now()
            && ($this->usage_limit === null || $this->usage_count < $this->usage_limit);
    }

    // ========== HELPERS ==========
    public function isValid()
    {
        return $this->is_active 
            && $this->start_date <= now() 
            && $this->end_date >= now()
            && ($this->usage_limit === null || $this->usage_count < $this->usage_limit);
    }

    public function isValidForUser($userId)
    {
        if (!$this->isValid()) {
            return false;
        }

        if ($this->per_user_limit === null) {
            return true;
        }

        $userRedemptions = $this->redemptions()->where('user_id', $userId)->count();
        return $userRedemptions < $this->per_user_limit;
    }

    public function calculateDiscount($amount)
    {
        if ($amount < $this->min_order_amount) {
            return 0;
        }

        $discount = 0;
        if ($this->discount_type === 'percentage') {
            $discount = ($amount * $this->discount_value) / 100;
        } else {
            $discount = $this->discount_value;
        }

        if ($this->max_discount_amount && $discount > $this->max_discount_amount) {
            $discount = $this->max_discount_amount;
        }

        return $discount;
    }

    public function incrementUsage()
    {
        $this->increment('usage_count');
    }

    public function redeem($userId, $bookingId, $discountAmount)
    {
        $redemption = $this->redemptions()->create([
            'user_id' => $userId,
            'booking_id' => $bookingId,
            'discount_amount' => $discountAmount,
        ]);

        $this->incrementUsage();

        return $redemption;
    }
}