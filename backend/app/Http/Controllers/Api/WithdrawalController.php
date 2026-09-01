<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VendorPayout;
use App\Models\VendorProfile;
use App\Models\Wallet;
use App\Services\WalletService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class WithdrawalController extends Controller
{
    protected $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = $walletService;
    }

    /**
     * Get vendor withdrawals
     * GET /api/vendor/withdrawals
     */
    public function index(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;

            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $withdrawals = VendorPayout::where('vendor_id', $vendor->id)
                ->with(['vendor', 'paymentMethod', 'approvedBy', 'processedBy'])
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'withdrawals' => $withdrawals,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get withdrawals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get withdrawal details
     * GET /api/vendor/withdrawals/:id
     */
    public function show($id, Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;

            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $withdrawal = VendorPayout::where('vendor_id', $vendor->id)
                ->with(['vendor', 'paymentMethod', 'approvedBy', 'processedBy', 'rejectedBy'])
                ->find($id);

            if (!$withdrawal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Withdrawal not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'withdrawal' => $withdrawal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get withdrawal details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Request withdrawal
     * POST /api/vendor/withdrawals
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0.01',
            'payment_method_id' => 'required|integer',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = $request->user()->vendorProfile;

            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $amount = (float) $request->input('amount');
            $wallet = Wallet::where('user_id', $vendor->user_id)->first();

            if (!$wallet) {
                return response()->json([
                    'success' => false,
                    'message' => 'Vendor wallet not found'
                ], 404);
            }

            // Check available balance
            if ((float) $wallet->balance < $amount) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient available balance',
                    'available_balance' => $wallet->balance,
                    'requested_amount' => $amount,
                ], 400);
            }

            // Verify payment method
            $paymentMethod = $vendor->paymentMethods()
                ->where('id', $request->payment_method_id)
                ->where('is_active', true)
                ->where('verification_status', 'verified')
                ->first();

            if (!$paymentMethod) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment method not found or not verified'
                ], 422);
            }

            // Create withdrawal using database transaction
            $withdrawal = DB::transaction(function () use ($request, $vendor, $amount, $paymentMethod) {
                $payout = VendorPayout::create([
                    'vendor_id' => $vendor->id,
                    'payment_method_id' => $paymentMethod->id,
                    'amount' => $amount,
                    'status' => 'pending',
                    'payout_status' => 'pending',
                    'notes' => $request->input('notes'),
                ]);

                // Reserve the amount in wallet
                $this->walletService->reserveWithdrawal($vendor->user, $payout, $amount);

                return $payout;
            });

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal request submitted successfully',
                'withdrawal' => $withdrawal,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to request withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel withdrawal (only if pending)
     * DELETE /api/vendor/withdrawals/:id
     */
    public function cancel($id, Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;

            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $withdrawal = VendorPayout::where('vendor_id', $vendor->id)->find($id);

            if (!$withdrawal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Withdrawal not found'
                ], 404);
            }

            if ($withdrawal->status !== 'pending' && $withdrawal->payout_status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Can only cancel pending withdrawals'
                ], 400);
            }

            // Update status and release reserved amount
            $withdrawal->update([
                'status' => 'cancelled',
                'payout_status' => 'rejected',
            ]);

            // Release reserved amount back to wallet
            $wallet = Wallet::where('user_id', $vendor->user_id)->first();
            if ($wallet) {
                $wallet->increment('balance', $withdrawal->amount);
            }

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal cancelled successfully',
                'withdrawal' => $withdrawal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Get all pending withdrawals
     * GET /api/admin/withdrawals
     */
    public function adminIndex(Request $request)
    {
        try {
            $query = VendorPayout::query()
                ->with(['vendor', 'vendor.user', 'paymentMethod', 'approvedBy', 'processedBy']);

            // Filter by status
            if ($request->status) {
                $query->where('payout_status', $request->status);
            }

            $withdrawals = $query
                ->orderBy('created_at', 'desc')
                ->paginate($request->per_page ?? 20);

            return response()->json([
                'success' => true,
                'withdrawals' => $withdrawals,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get withdrawals',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Approve withdrawal
     * POST /api/admin/withdrawals/:id/approve
     */
    public function approve($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'admin_note' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $withdrawal = VendorPayout::find($id);

            if (!$withdrawal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Withdrawal not found'
                ], 404);
            }

            if ($withdrawal->payout_status !== 'pending') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending withdrawals can be approved'
                ], 400);
            }

            $withdrawal->update([
                'payout_status' => 'approved',
                'status' => 'processing',
                'approved_by' => $request->user()->id,
                'approved_at' => now(),
                'admin_note' => $request->input('admin_note'),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal approved successfully',
                'withdrawal' => $withdrawal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Reject withdrawal
     * POST /api/admin/withdrawals/:id/reject
     */
    public function reject($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|max:500',
            'admin_note' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $withdrawal = VendorPayout::find($id);

            if (!$withdrawal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Withdrawal not found'
                ], 404);
            }

            if (!in_array($withdrawal->payout_status, ['pending', 'approved'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Only pending or approved withdrawals can be rejected'
                ], 400);
            }

            $withdrawal->update([
                'payout_status' => 'rejected',
                'status' => 'failed',
                'rejected_by' => $request->user()->id,
                'rejected_at' => now(),
                'rejection_reason' => $request->input('reason'),
                'admin_note' => $request->input('admin_note'),
            ]);

            // Release reserved amount back to vendor wallet
            $vendor = $withdrawal->vendor;
            $wallet = Wallet::where('user_id', $vendor->user_id)->first();
            if ($wallet) {
                $wallet->increment('balance', $withdrawal->amount);
            }

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal rejected successfully',
                'withdrawal' => $withdrawal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Mark withdrawal as processing/completed
     * POST /api/admin/withdrawals/:id/processing
     */
    public function markProcessing($id, Request $request)
    {
        try {
            $withdrawal = VendorPayout::find($id);

            if (!$withdrawal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Withdrawal not found'
                ], 404);
            }

            if ($withdrawal->payout_status !== 'approved') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only approved withdrawals can be marked as processing'
                ], 400);
            }

            $withdrawal->update([
                'payout_status' => 'processing',
                'status' => 'processing',
                'processed_by' => $request->user()->id,
                'processed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal marked as processing',
                'withdrawal' => $withdrawal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update withdrawal status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Admin: Mark withdrawal as completed
     * POST /api/admin/withdrawals/:id/complete
     */
    public function markCompleted($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'transaction_id' => 'nullable|string|max:255',
            'reference_number' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $withdrawal = VendorPayout::find($id);

            if (!$withdrawal) {
                return response()->json([
                    'success' => false,
                    'message' => 'Withdrawal not found'
                ], 404);
            }

            if ($withdrawal->payout_status !== 'processing') {
                return response()->json([
                    'success' => false,
                    'message' => 'Only processing withdrawals can be marked as completed'
                ], 400);
            }

            $withdrawal->update([
                'payout_status' => 'completed',
                'status' => 'completed',
                'transaction_id' => $request->input('transaction_id'),
                'reference_number' => $request->input('reference_number'),
                'completed_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal marked as completed',
                'withdrawal' => $withdrawal,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete withdrawal',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
