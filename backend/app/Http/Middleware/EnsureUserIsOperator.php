<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsOperator
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

        if ($user->role !== 'operator') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Operator access required.',
                'error' => 'Forbidden'
            ], 403);
        }

        // Check if operator profile exists
        if (!$user->operator) {
            return response()->json([
                'success' => false,
                'message' => 'Operator profile not found.',
                'error' => 'Profile not found'
            ], 404);
        }

        // Check if operator is active
        if (!$user->is_active || !$user->operator->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your operator account is deactivated.',
                'error' => 'Account deactivated'
            ], 403);
        }

        // Check if operator is verified
        if (!$user->operator->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'Your operator account is pending verification.',
                'error' => 'Pending verification',
                'status' => $user->operator->verification_status
            ], 403);
        }

        return $next($request);
    }
}