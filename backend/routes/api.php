<?php

use App\Http\Controllers\PingController;
use Illuminate\Support\Facades\Route;

Route::get('/ping', [PingController::class, 'index'])->middleware('throttle:60,1');
Route::post('/ping', [PingController::class, 'store'])->middleware('throttle:60,1');
