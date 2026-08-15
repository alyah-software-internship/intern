<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'product_id',
        'image_url',
        'alt_text',
        'is_primary',
        'sort_order',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'sort_order' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // ========== SCOPES ==========
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }

    // ========== HELPERS ==========
    public function isPrimary()
    {
        return $this->is_primary;
    }

    public function setAsPrimary()
    {
        // Remove primary from all other images
        $this->product->images()->where('id', '!=', $this->id)->update(['is_primary' => false]);
        $this->update(['is_primary' => true]);
    }

    public function getImageUrlAttribute($value)
    {
        // If it's a relative path, prepend storage URL
        if (!str_starts_with($value, 'http')) {
            return asset('storage/' . $value);
        }
        return $value;
    }
}