<?php

namespace App\Services;

use App\Models\User;
use App\Models\VendorPayout;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class WalletService
{
    public function getOrCreate(User $user): Wallet
    {
        return Wallet::firstOrCreate(
            ['user_id' => $user->id],
            ['currency' => 'ETB', 'status' => 'active']
        );
    }

    public function summary(User $user): array
    {
        $wallet = $this->getOrCreate($user);
        $withdrawn = WalletTransaction::where('wallet_id', $wallet->id)
            ->where('type', 'withdrawal')
            ->where('status', 'completed')
            ->sum('amount');
        $earned = WalletTransaction::where('wallet_id', $wallet->id)
            ->where('type', 'vendor_earning')
            ->where('status', 'completed')
            ->sum('amount');

        return [
            'available_balance' => $wallet->balance,
            'pending_balance' => $wallet->pending_balance,
            'total_earnings' => $earned,
            'total_withdrawn' => $withdrawn,
            'currency' => $wallet->currency,
        ];
    }

    public function addPendingEarning(User $vendor, float $amount, array $context = []): WalletTransaction
    {
        return DB::transaction(function () use ($vendor, $amount, $context) {
            $wallet = Wallet::where('user_id', $vendor->id)->lockForUpdate()->first();
            if (!$wallet) {
                $wallet = Wallet::create(['user_id' => $vendor->id, 'currency' => 'ETB']);
            }
            $before = (float) $wallet->pending_balance;
            $after = $before + $amount;
            $wallet->update(['pending_balance' => $after]);

            return $this->record($wallet, $amount, $before, $after, 'vendor_earning', $context, 'Vendor earning pending release');
        });
    }

    public function releasePending(User $vendor, float $amount, array $context = []): WalletTransaction
    {
        return DB::transaction(function () use ($vendor, $amount, $context) {
            $wallet = Wallet::where('user_id', $vendor->id)->lockForUpdate()->firstOrFail();
            if ((float) $wallet->pending_balance < $amount) {
                throw new \RuntimeException('Pending balance is insufficient.');
            }
            $before = (float) $wallet->balance;
            $pending = (float) $wallet->pending_balance - $amount;
            $after = $before + $amount;
            $wallet->update(['balance' => $after, 'pending_balance' => $pending]);

            return $this->record($wallet, $amount, $before, $after, 'adjustment', $context, 'Vendor earning released to available balance');
        });
    }

    public function reserveWithdrawal(User $vendor, VendorPayout $payout, float $amount): WalletTransaction
    {
        return DB::transaction(function () use ($vendor, $payout, $amount) {
            $wallet = Wallet::where('user_id', $vendor->id)->lockForUpdate()->firstOrFail();
            if ((float) $wallet->balance < $amount) {
                throw new \RuntimeException('Available balance is insufficient.');
            }
            $before = (float) $wallet->balance;
            $after = $before - $amount;
            $wallet->update(['balance' => $after]);

            return $this->record($wallet, -$amount, $before, $after, 'withdrawal', [
                'payout_id' => $payout->id,
            ], 'Withdrawal amount reserved');
        });
    }

    private function record(Wallet $wallet, float $amount, float $before, float $after, string $type, array $metadata, string $description): WalletTransaction
    {
        return $wallet->transactions()->create([
            'booking_id' => $metadata['booking_id'] ?? null,
            'payment_id' => $metadata['payment_id'] ?? null,
            'amount' => $amount,
            'balance_before' => $before,
            'balance_after' => $after,
            'type' => $type,
            'status' => 'completed',
            'reference' => 'WLT-' . strtoupper(Str::random(20)),
            'description' => $description,
            'metadata' => $metadata,
        ]);
    }
}
