<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperatorAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'operator_id',
        'date',
        'status',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }

    // ========== SCOPES ==========
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeBooked($query)
    {
        return $query->where('status', 'booked');
    }

    public function scopeOnDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeBetweenDates($query, $start, $end)
    {
        return $query->whereBetween('date', [$start, $end]);
    }

    // ========== ACCESSORS ==========
    public function getStatusLabelAttribute()
    {
        $statuses = [
            'available' => 'Available',
            'booked' => 'Booked',
            'unavailable' => 'Unavailable',
            'holiday' => 'Holiday',
        ];
        return $statuses[$this->status] ?? $this->status;
    }

    // ========== HELPERS ==========
    public function isAvailable()
    {
        return $this->status === 'available';
    }

    public function isBooked()
    {
        return $this->status === 'booked';
    }

    public function markAsAvailable()
    {
        $this->update(['status' => 'available']);
    }

    public function markAsBooked()
    {
        $this->update(['status' => 'booked']);
    }

    public function markAsUnavailable()
    {
        $this->update(['status' => 'unavailable']);
    }

    public function markAsHoliday()
    {
        $this->update(['status' => 'holiday']);
    }
}