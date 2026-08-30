<?php

namespace App\Http\Middleware;

use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, return null to trigger 401 response
        if ($request->expectsJson() || $request->is('api/*')) {
            return null;
        }

        return $request->expectsJson() ? null : route('login');
    }

    /**
     * Handle unauthenticated API requests
     */
    protected function unauthenticated($request, array $guards)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            throw new AuthenticationException('Unauthenticated. Please login to continue.', $guards);
        }

        parent::unauthenticated($request, $guards);
    }
}