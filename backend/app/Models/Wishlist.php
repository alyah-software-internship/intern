<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    // ========== SCOPES ==========
    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    // ========== HELPERS ==========
    public function isInWishlist($userId, $productId)
    {
        return static::where('user_id', $userId)
                    ->where('product_id', $productId)
                    ->exists();
    }

    public function toggle($userId, $productId)
    {
        $wishlist = static::where('user_id', $userId)
                        ->where('product_id', $productId)
                        ->first();

        if ($wishlist) {
            $wishlist->delete();
            return false; // Removed from wishlist
        }

        static::create([
            'user_id' => $userId,
            'product_id' => $productId,
        ]);
        return true; // Added to wishlist
    }
}