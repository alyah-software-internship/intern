<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlatformCommissionSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'commission_type',
        'commission_value',
        'min_commission',
        'max_commission',
        'applies_to',
        'is_active',
        'currency',
    ];

    protected $casts = [
        'commission_value' => 'decimal:2',
        'min_commission' => 'decimal:2',
        'max_commission' => 'decimal:2',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== SCOPES ==========
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAppliesTo($query, $model)
    {
        return $query->where('applies_to', 'all')->orWhere('applies_to', $model);
    }

    // ========== ACCESSORS ==========
    public function getCommissionTypeLabelAttribute()
    {
        $types = [
            'percentage' => 'Percentage',
            'fixed' => 'Fixed Amount',
        ];
        return $types[$this->commission_type] ?? $this->commission_type;
    }

    public function getAppliesToLabelAttribute()
    {
        $types = [
            'all' => 'All',
            'hourly' => 'Hourly',
            'daily' => 'Daily',
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
        ];
        return $types[$this->applies_to] ?? $this->applies_to;
    }

    // ========== HELPERS ==========
    public function calculateCommission($amount)
    {
        if (!$this->is_active) {
            return 0;
        }

        $commission = 0;
        if ($this->commission_type === 'percentage') {
            $commission = ($amount * $this->commission_value) / 100;
        } else {
            $commission = $this->commission_value;
        }

        if ($this->min_commission && $commission < $this->min_commission) {
            $commission = $this->min_commission;
        }

        if ($this->max_commission && $commission > $this->max_commission) {
            $commission = $this->max_commission;
        }

        return $commission;
    }

    public static function getActiveCommission($model = 'all')
    {
        return static::active()->appliesTo($model)->first();
    }
}