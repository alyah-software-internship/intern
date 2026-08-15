<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorPayout extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id',
        'payment_method_id',
        'booking_id',
        'amount',
        'platform_commission',
        'net_amount',
        'status',
        'transaction_id',
        'reference_number',
        'processing_fee',
        'notes',
        'processed_by',
        'processed_at',
        'completed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'platform_commission' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'processing_fee' => 'decimal:2',
        'processed_at' => 'datetime',
        'completed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function vendor()
    {
        return $this->belongsTo(VendorProfile::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(VendorPaymentMethod::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function processedBy()
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // ========== SCOPES ==========
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeProcessing($query)
    {
        return $query->where('status', 'processing');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }

    public function scopeByVendor($query, $vendorId)
    {
        return $query->where('vendor_id', $vendorId);
    }

    // ========== ACCESSORS ==========
    public function getStatusLabelAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'failed' => 'Failed',
            'cancelled' => 'Cancelled',
        ];
        return $statuses[$this->status] ?? $this->status;
    }

    // ========== HELPERS ==========
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isProcessing()
    {
        return $this->status === 'processing';
    }

    public function isCompleted()
    {
        return $this->status === 'completed';
    }

    public function isFailed()
    {
        return $this->status === 'failed';
    }

    public function process($adminId)
    {
        $this->update([
            'status' => 'processing',
            'processed_by' => $adminId,
            'processed_at' => now(),
        ]);
    }

    public function complete($transactionId = null)
    {
        $this->update([
            'status' => 'completed',
            'transaction_id' => $transactionId ?? $this->transaction_id,
            'completed_at' => now(),
        ]);
    }

    public function fail($reason = null)
    {
        $this->update([
            'status' => 'failed',
            'notes' => $reason,
        ]);
    }
}