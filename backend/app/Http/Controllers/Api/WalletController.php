<?php

namespace App\Http\Controllers\Api;

use App\Models\VendorPayout;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class WalletController
{
    public function __construct(private WalletService $walletService)
    {
    }

    public function show(Request $request)
    {
        return response()->json([
            'success' => true,
            'wallet' => $this->walletService->summary($request->user()),
        ]);
    }

    public function transactions(Request $request)
    {
        $wallet = $this->walletService->getOrCreate($request->user());
        return response()->json([
            'success' => true,
            'transactions' => $wallet->transactions()->latest()->paginate(25),
        ]);
    }

    public function payouts(Request $request)
    {
        $vendor = $request->user()->vendorProfile;
        return response()->json([
            'success' => true,
            'payouts' => $vendor->payouts()->with('paymentMethod')->latest()->paginate(25),
        ]);
    }

    public function requestPayout(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0.01',
            'payment_method_id' => 'required|integer',
            'notes' => 'nullable|string|max:1000',
        ]);
        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => 'Validation failed', 'errors' => $validator->errors()], 422);
        }

        $vendor = $request->user()->vendorProfile;
        $method = $vendor->paymentMethods()
            ->whereKey($request->integer('payment_method_id'))
            ->where('is_active', true)
            ->where('verification_status', 'verified')
            ->first();
        if (!$method) {
            return response()->json(['success' => false, 'message' => 'Use an active, verified payout method.'], 422);
        }

        try {
            $payout = DB::transaction(function () use ($request, $vendor, $method) {
                $amount = (float) $request->input('amount');
                $payout = VendorPayout::create([
                    'vendor_id' => $vendor->id,
                    'payment_method_id' => $method->id,
                    'amount' => $amount,
                    'platform_commission' => 0,
                    'net_amount' => $amount,
                    'status' => 'pending',
                    'notes' => $request->input('notes'),
                ]);
                app(WalletService::class)->reserveWithdrawal($vendor->user, $payout, $amount);
                return $payout;
            });
            return response()->json(['success' => true, 'message' => 'Withdrawal request submitted.', 'payout' => $payout], 201);
        } catch (\Throwable $exception) {
            return response()->json(['success' => false, 'message' => $exception->getMessage()], 422);
        }
    }
}
