<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalletTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'wallet_id', 'booking_id', 'payment_id', 'type', 'amount',
        'balance_before', 'balance_after', 'status', 'reference',
        'description', 'metadata',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'balance_before' => 'decimal:2',
        'balance_after' => 'decimal:2',
        'metadata' => 'array',
    ];

    public function wallet()
    {
        return $this->belongsTo(Wallet::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    protected static function booted(): void
    {
        static::updating(function () {
            throw new \LogicException('Wallet transactions are immutable. Create a reversal or adjustment instead.');
        });
        static::deleting(function () {
            throw new \LogicException('Wallet transactions cannot be deleted.');
        });
    }
}
