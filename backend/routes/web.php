<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});


Route::get('/hello', function () {
    return 'Hello, World!';
});

Route::get('/greet/{name}', function ($name) {
    
    return "Hello, $name!";
});

Route::get('/search', function (Request $request) {
    return $request->name . ' ' . $request->address;
});