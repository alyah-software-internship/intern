<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityDeposit extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'customer_id',
        'vendor_id',
        'amount',
        'status',
        'payment_transaction_id',
        'release_transaction_id',
        'refund_transaction_id',
        'held_at',
        'released_at',
        'refunded_at',
        'deducted_amount',
        'deduction_reason',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'deducted_amount' => 'decimal:2',
        'held_at' => 'datetime',
        'released_at' => 'datetime',
        'refunded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function booking()
    {
        return $this->belongsTo(Booking::class);
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
    public function scopeHeld($query)
    {
        return $query->where('status', 'held');
    }

    public function scopeReleased($query)
    {
        return $query->where('status', 'released');
    }

    public function scopeRefunded($query)
    {
        return $query->where('status', 'refunded');
    }

    public function scopeDeducted($query)
    {
        return $query->where('status', 'deducted');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeDisputed($query)
    {
        return $query->where('status', 'disputed');
    }

    // ========== ACCESSORS ==========
    public function getStatusLabelAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'held' => 'Held',
            'released' => 'Released',
            'refunded' => 'Refunded',
            'deducted' => 'Deducted',
            'disputed' => 'Disputed',
        ];
        return $statuses[$this->status] ?? $this->status;
    }

    // ========== HELPERS ==========
    public function isHeld()
    {
        return $this->status === 'held';
    }

    public function isReleased()
    {
        return $this->status === 'released';
    }

    public function isRefunded()
    {
        return $this->status === 'refunded';
    }

    public function isDeducted()
    {
        return $this->status === 'deducted';
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isDisputed()
    {
        return $this->status === 'disputed';
    }

    public function hold()
    {
        $this->update([
            'status' => 'held',
            'held_at' => now(),
        ]);
    }

    public function release($full = true)
    {
        if ($full) {
            $this->update([
                'status' => 'released',
                'released_at' => now(),
                'deducted_amount' => 0,
                'deduction_reason' => null,
            ]);
        } else {
            $this->update([
                'status' => 'deducted',
                'released_at' => now(),
            ]);
        }
    }

    public function refund()
    {
        $this->update([
            'status' => 'refunded',
            'refunded_at' => now(),
        ]);
    }

    public function deduct($amount, $reason)
    {
        $this->update([
            'status' => 'deducted',
            'deducted_amount' => $amount,
            'deduction_reason' => $reason,
            'released_at' => now(),
        ]);
    }

    public function getRefundableAmount()
    {
        if ($this->status === 'held') {
            return $this->amount;
        }
        if ($this->status === 'deducted') {
            return $this->amount - $this->deducted_amount;
        }
        return 0;
    }
}