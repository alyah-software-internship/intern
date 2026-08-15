<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsActive
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

        // Check if user is active
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your account is deactivated. Please contact support.',
                'error' => 'Account deactivated'
            ], 403);
        }

        // Check if user is banned
        if ($user->is_banned) {
            return response()->json([
                'success' => false,
                'message' => 'Your account has been banned. Reason: ' . ($user->banned_reason ?? 'No reason provided'),
                'error' => 'Account banned',
                'banned_at' => $user->banned_at?->toISOString()
            ], 403);
        }

        return $next($request);
    }
}