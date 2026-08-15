<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_reference',
        'product_id',
        'customer_id',
        'vendor_id',
        'operator_id',
        'start_date',
        'end_date',
        'rental_days',
        'rental_hours',
        'pricing_model',
        'rental_amount',
        'operator_charge',
        'security_deposit_amount',
        'delivery_charge',
        'discount_amount',
        'coupon_code',
        'platform_fee',
        'total_amount',
        'vendor_payment',
        'platform_commission',
        'security_deposit_held',
        'status',
        'payment_status',
        'security_deposit_status',
        'operator_status',
        'payment_method',
        'transaction_id',
        'delivery_address',
        'delivery_address_am',
        'special_requests',
        'cancellation_reason',
        'cancelled_at',
        'completed_at',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'cancelled_at' => 'datetime',
        'completed_at' => 'datetime',
        'rental_days' => 'integer',
        'rental_hours' => 'integer',
        'rental_amount' => 'decimal:2',
        'operator_charge' => 'decimal:2',
        'security_deposit_amount' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'platform_fee' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'vendor_payment' => 'decimal:2',
        'platform_commission' => 'decimal:2',
        'security_deposit_held' => 'boolean',
    ];

    // ========== RELATIONSHIPS ==========
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

    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function securityDeposit()
    {
        return $this->hasOne(SecurityDeposit::class);
    }

    public function review()
    {
        return $this->hasOne(Review::class);
    }

    // ========== SCOPES ==========
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    // ========== HELPERS ==========
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isConfirmed()
    {
        return $this->status === 'confirmed';
    }

    public function isActive()
    {
        return $this->status === 'active';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function isPaid()
    {
        return $this->payment_status === 'paid';
    }
}