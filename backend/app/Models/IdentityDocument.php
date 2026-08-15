<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class IdentityDocument extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'document_type',
        'document_number',
        'document_country',
        'document_issue_date',
        'document_expiry_date',
        'document_front_url',
        'document_back_url',
        'selfie_with_document_url',
        'verification_status',
        'verification_notes',
        'verified_by',
        'verified_at',
        'rejection_reason',
        'is_primary',
    ];

    protected $casts = [
        'document_issue_date' => 'date',
        'document_expiry_date' => 'date',
        'verified_at' => 'datetime',
        'is_primary' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function verifiedBy()
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    // ========== SCOPES ==========
    public function scopePending($query)
    {
        return $query->where('verification_status', 'pending');
    }

    public function scopeVerified($query)
    {
        return $query->where('verification_status', 'verified');
    }

    public function scopeRejected($query)
    {
        return $query->where('verification_status', 'rejected');
    }

    public function scopeExpired($query)
    {
        return $query->where('verification_status', 'expired');
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('document_type', $type);
    }

    // ========== ACCESSORS ==========
    public function getDocumentTypeLabelAttribute()
    {
        $types = [
            'national_id' => 'National ID',
            'passport' => 'Passport',
            'drivers_license' => "Driver's License",
            'voter_id' => 'Voter ID',
            'other' => 'Other',
        ];
        return $types[$this->document_type] ?? $this->document_type;
    }

    public function getVerificationStatusLabelAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'under_review' => 'Under Review',
            'verified' => 'Verified',
            'rejected' => 'Rejected',
            'expired' => 'Expired',
        ];
        return $statuses[$this->verification_status] ?? $this->verification_status;
    }

    public function getIsExpiredAttribute()
    {
        return $this->document_expiry_date && $this->document_expiry_date < now();
    }

    // ========== HELPERS ==========
    public function isPending()
    {
        return $this->verification_status === 'pending';
    }

    public function isVerified()
    {
        return $this->verification_status === 'verified';
    }

    public function isRejected()
    {
        return $this->verification_status === 'rejected';
    }

    public function isExpired()
    {
        return $this->verification_status === 'expired';
    }

    public function isPrimary()
    {
        return $this->is_primary;
    }

    public function approve($adminId, $notes = null)
    {
        $this->update([
            'verification_status' => 'verified',
            'verified_by' => $adminId,
            'verified_at' => now(),
            'verification_notes' => $notes,
            'rejection_reason' => null,
        ]);

        // Update user verification status
        $this->user->update([
            'identity_verified' => true,
            'identity_verified_at' => now(),
        ]);
    }

    public function reject($adminId, $reason)
    {
        $this->update([
            'verification_status' => 'rejected',
            'verified_by' => $adminId,
            'verified_at' => now(),
            'rejection_reason' => $reason,
        ]);
    }

    public function setAsPrimary()
    {
        // Remove primary from all other documents
        $this->user->identityDocuments()->where('id', '!=', $this->id)->update(['is_primary' => false]);
        $this->update(['is_primary' => true]);
    }
}