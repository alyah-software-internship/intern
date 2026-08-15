<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsVendor
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($user->role !== 'vendor') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Vendor access required.',
                'error' => 'Forbidden'
            ], 403);
        }

        // Check if vendor profile exists
        if (!$user->vendorProfile) {
            return response()->json([
                'success' => false,
                'message' => 'Vendor profile not found. Please complete your vendor registration.',
                'error' => 'Profile incomplete'
            ], 403);
        }

        // Check if vendor is approved
        if ($user->vendorProfile->verification_status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Your vendor account is pending approval.',
                'error' => 'Pending approval',
                'status' => $user->vendorProfile->verification_status
            ], 403);
        }

        // Check if vendor is active
        if (!$user->is_active || !$user->vendorProfile->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your vendor account is deactivated.',
                'error' => 'Account deactivated'
            ], 403);
        }

        return $next($request);
    }
}