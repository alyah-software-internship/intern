<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
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

        if ($user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Admin access required.',
                'error' => 'Forbidden'
            ], 403);
        }

        // Check if admin is active
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Your admin account is deactivated.',
                'error' => 'Account deactivated'
            ], 403);
        }

        return $next($request);
    }
}