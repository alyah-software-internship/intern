<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VendorPaymentMethod extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'vendor_id',
        'payment_type',
        'account_name',
        'account_number',
        'bank_name',
        'bank_branch',
        'swift_code',
        'mobile_provider',
        'mobile_number',
        'paypal_email',
        'stripe_account_id',
        'chapa_account_id',
        'is_primary',
        'is_active',
        'verification_status',
        'verified_by',
        'verified_at',
        'verification_notes',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
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

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function payouts()
    {
        return $this->hasMany(VendorPayout::class);
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

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('payment_type', $type);
    }

    // ========== ACCESSORS ==========
    public function getPaymentTypeLabelAttribute()
    {
        $types = [
            'bank_transfer' => 'Bank Transfer',
            'mobile_money' => 'Mobile Money',
            'paypal' => 'PayPal',
            'stripe' => 'Stripe',
            'chapa' => 'Chapa',
            'telebirr' => 'Telebirr',
            'other' => 'Other',
        ];
        return $types[$this->payment_type] ?? $this->payment_type;
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

    public function getDisplayNameAttribute()
    {
        return $this->account_name . ' (' . $this->payment_type_label . ')';
    }

    public function getMaskedAccountNumberAttribute()
    {
        if (strlen($this->account_number) > 4) {
            return str_repeat('*', strlen($this->account_number) - 4) . substr($this->account_number, -4);
        }
        return $this->account_number;
    }

    // ========== HELPERS ==========
    public function isVerified()
    {
        return $this->verification_status === 'verified';
    }

    public function isPrimary()
    {
        return $this->is_primary;
    }

    public function isActive()
    {
        return $this->is_active;
    }

    public function verify($adminId, $notes = null)
    {
        $this->update([
            'verification_status' => 'verified',
            'verified_by' => $adminId,
            'verified_at' => now(),
            'verification_notes' => $notes,
        ]);
    }

    public function reject($adminId, $notes = null)
    {
        $this->update([
            'verification_status' => 'rejected',
            'verified_by' => $adminId,
            'verified_at' => now(),
            'verification_notes' => $notes,
        ]);
    }

    public function setAsPrimary()
    {
        // Remove primary from all other methods
        $this->vendor->paymentMethods()->where('id', '!=', $this->id)->update(['is_primary' => false]);
        $this->update(['is_primary' => true]);
    }

    public function deactivate()
    {
        $this->update(['is_active' => false]);
    }

    public function activate()
    {
        $this->update(['is_active' => true]);
    }
}