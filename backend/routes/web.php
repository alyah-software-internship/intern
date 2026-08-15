<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home page route (will be handled by React frontend)
Route::get('/', function () {
    return view('welcome');
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