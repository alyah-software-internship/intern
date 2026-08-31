<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispute extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'security_deposit_id',
        'complainant_id',
        'respondent_id',
        'title',
        'description',
        'status',
        'reason',
        'resolution_notes',
        'admin_notes',
        'assigned_to',
        'resolved_by',
        'resolved_at',
        'closed_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function securityDeposit()
    {
        return $this->belongsTo(SecurityDeposit::class);
    }

    public function complainant()
    {
        return $this->belongsTo(User::class, 'complainant_id');
    }

    public function respondent()
    {
        return $this->belongsTo(User::class, 'respondent_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function resolvedBy()
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }

    // ========== SCOPES ==========
    public function scopeOpen($query)
    {
        return $query->where('status', 'open');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeResolved($query)
    {
        return $query->where('status', 'resolved');
    }

    public function scopeClosed($query)
    {
        return $query->where('status', 'closed');
    }

    // ========== HELPERS ==========
    public function isOpen()
    {
        return $this->status === 'open';
    }

    public function isInProgress()
    {
        return $this->status === 'in_progress';
    }

    public function isResolved()
    {
        return $this->status === 'resolved';
    }

    public function isClosed()
    {
        return $this->status === 'closed';
    }

    public function markInProgress($adminId = null)
    {
        $this->update([
            'status' => 'in_progress',
            'assigned_to' => $adminId,
        ]);
    }

    public function resolve($notes, $adminId = null)
    {
        $this->update([
            'status' => 'resolved',
            'resolution_notes' => $notes,
            'resolved_by' => $adminId,
            'resolved_at' => now(),
        ]);
    }

    public function close($adminId = null)
    {
        $this->update([
            'status' => 'closed',
            'resolved_by' => $adminId,
            'closed_at' => now(),
        ]);
    }
}
