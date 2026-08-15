<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;

class PreventRequestsDuringMaintenance extends Middleware
{
    protected $except = [
        // URLs that should be accessible during maintenance
        '/api/health',
        '/api/maintenance-status',
        '/api/v1/health',
    ];
}