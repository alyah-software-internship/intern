<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductOperatorAssignment extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'operator_id',
        'is_primary',
        'is_active',
        'assignment_date',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'is_active' => 'boolean',
        'assignment_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function operator()
    {
        return $this->belongsTo(Operator::class);
    }

    // ========== SCOPES ==========
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    // ========== HELPERS ==========
    public function isPrimary()
    {
        return $this->is_primary;
    }

    public function isActive()
    {
        return $this->is_active;
    }

    public function setAsPrimary()
    {
        // Remove primary from all other assignments
        $this->product->operatorAssignments()->where('id', '!=', $this->id)->update(['is_primary' => false]);
        $this->update(['is_primary' => true]);
    }
}