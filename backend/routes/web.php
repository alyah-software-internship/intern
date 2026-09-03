<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// The React frontend is deployed separately as a static site.
Route::get('/', function () {
    return response()->json([
        'name' => 'i-Share API',
        'status' => 'online',
        'api' => '/api',
        'health' => '/health',
    ]);
});

// Hello world test route
Route::get('/hello', function () {
    return 'Hello, World!';
});

// Greeting route with parameter
Route::get('/greet/{name}', function ($name) {
    return "Hello, $name!";
});

// Health check route
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'app' => 'i-Share API',
        'version' => '1.0.0'
    ]);
});

// Fallback route - redirect to frontend
Route::fallback(function () {
    return redirect('/');
});