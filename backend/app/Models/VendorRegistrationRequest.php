<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorRegistrationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'business_name_am',
        'business_type',
        'business_type_am',
        'description',
        'description_am',
        'address',
        'address_am',
        'city',
        'city_am',
        'country',
        'postal_code',
        'phone',
        'email',
        'website',
        'tax_id',
        'registration_number',
        'business_license_url',
        'tax_certificate_url',
        'additional_documents',
        'status',
        'admin_notes',
        'reviewed_by',
        'reviewed_at',
        'changes_requested',
        'resubmission_count',
        'identity_verified_required',
        'identity_verified_at',
        'submitted_at',
    ];

    protected $casts = [
        'additional_documents' => 'array',
        'reviewed_at' => 'datetime',
        'identity_verified_at' => 'datetime',
        'submitted_at' => 'datetime',
        'identity_verified_required' => 'boolean',
        'resubmission_count' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function reviewedBy()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // ========== SCOPES ==========
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeUnderReview($query)
    {
        return $query->where('status', 'under_review');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeRequiresChanges($query)
    {
        return $query->where('status', 'requires_changes');
    }

    // ========== ACCESSORS ==========
    public function getStatusLabelAttribute()
    {
        $statuses = [
            'pending' => 'Pending',
            'under_review' => 'Under Review',
            'approved' => 'Approved',
            'rejected' => 'Rejected',
            'requires_changes' => 'Requires Changes',
        ];
        return $statuses[$this->status] ?? $this->status;
    }

    public function getBusinessDisplayNameAttribute()
    {
        return $this->business_name_am ?? $this->business_name;
    }

    // ========== HELPERS ==========
    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isUnderReview()
    {
        return $this->status === 'under_review';
    }

    public function isApproved()
    {
        return $this->status === 'approved';
    }

    public function isRejected()
    {
        return $this->status === 'rejected';
    }

    public function requiresChanges()
    {
        return $this->status === 'requires_changes';
    }

    public function approve($adminId, $notes = null)
    {
        $this->update([
            'status' => 'approved',
            'reviewed_by' => $adminId,
            'reviewed_at' => now(),
            'admin_notes' => $notes,
        ]);

        // Create vendor profile
        $vendor = VendorProfile::create([
            'user_id' => $this->user_id,
            'business_name' => $this->business_name,
            'business_name_am' => $this->business_name_am,
            'business_type' => $this->business_type,
            'business_type_am' => $this->business_type_am,
            'description' => $this->description,
            'description_am' => $this->description_am,
            'address' => $this->address,
            'address_am' => $this->address_am,
            'city' => $this->city,
            'city_am' => $this->city_am,
            'country' => $this->country,
            'postal_code' => $this->postal_code,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'tax_id' => $this->tax_id,
            'registration_number' => $this->registration_number,
            'verification_status' => 'approved',
            'is_active' => true,
            'joined_date' => now(),
        ]);

        // Update user role
        $this->user->update(['role' => 'vendor']);

        return $vendor;
    }

    public function reject($adminId, $reason)
    {
        $this->update([
            'status' => 'rejected',
            'reviewed_by' => $adminId,
            'reviewed_at' => now(),
            'admin_notes' => $reason,
        ]);
    }

    public function requestChanges($adminId, $changes)
    {
        $this->update([
            'status' => 'requires_changes',
            'reviewed_by' => $adminId,
            'reviewed_at' => now(),
            'changes_requested' => $changes,
            'resubmission_count' => $this->resubmission_count + 1,
        ]);
    }

    public function resubmit($data)
    {
        $this->update(array_merge($data, [
            'status' => 'pending',
            'reviewed_by' => null,
            'reviewed_at' => null,
            'changes_requested' => null,
            'submitted_at' => now(),
        ]));
    }

    public function verifyIdentity()
    {
        $this->update([
            'identity_verified_at' => now(),
            'identity_verified_required' => true,
        ]);
    }
}