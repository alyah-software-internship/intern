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
        'refund_amount',
        'refund_transaction_id',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'payment_data' => 'array',
        'completed_at' => 'datetime',
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

    // ========== HELPERS ==========
    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isRefunded()
    {
        return $this->status === 'refunded';
    }
}