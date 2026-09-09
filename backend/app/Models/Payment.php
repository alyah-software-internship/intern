<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'user_id',
        'vendor_id',
        'amount',
        'payment_type',
        'payment_method',
        'transaction_id',
        'provider_reference',
        'idempotency_key',
        'status',
        'payment_status',
        'payment_data',
        'payment_proof_path',
        'payment_proof_type',
        'payment_remarks',
        'proof_verification_status',
        'verified_at',
        'verified_by',
        'refund_amount',
        'refund_transaction_id',
        'completed_at',
        'failed_at',
        'paid_at',
        'platform_fee',
        'vendor_amount',
        'webhook_verified',
        'webhook_verified_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'platform_fee' => 'decimal:2',
        'vendor_amount' => 'decimal:2',
        'payment_data' => 'array',
        'completed_at' => 'datetime',
        'failed_at' => 'datetime',
        'paid_at' => 'datetime',
        'verified_at' => 'datetime',
        'webhook_verified_at' => 'datetime',
        'webhook_verified' => 'boolean',
    ];

    // ========== RELATIONSHIPS ==========
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function vendor()
    {
        return $this->belongsTo(VendorProfile::class, 'vendor_id');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    // ========== HELPERS ==========
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isRefunded()
    {
        return $this->status === 'refunded';
    }

    public function isProofVerified()
    {
        return $this->proof_verification_status === 'verified';
    }

    public function isManualPaymentMethod()
    {
        return in_array($this->payment_method, ['cbe', 'telebirr']);
    }

    public function requiresProofVerification()
    {
        return $this->isManualPaymentMethod() && $this->payment_proof_path;
    }
}