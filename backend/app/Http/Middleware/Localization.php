<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Localization
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language', 'en');
        
        if (in_array($locale, ['en', 'am'])) {
            app()->setLocale($locale);
        }

        return $next($request);
    }
}