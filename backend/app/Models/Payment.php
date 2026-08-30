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
        'status',
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
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'payment_data' => 'array',
        'completed_at' => 'datetime',
        'verified_at' => 'datetime',
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

    public function vendor()
    {
        return $this->belongsTo(VendorProfile::class, 'vendor_id');
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
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