<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SectorController;
use App\Http\Controllers\UserAdminController;
use App\Http\Controllers\IssueController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require Bearer token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Sector management (admin only, enforced in controller)
    Route::get('/sectors', [SectorController::class, 'index']);
    Route::post('/sectors', [SectorController::class, 'store']);
    Route::put('/sectors/{sector}', [SectorController::class, 'update']);
    Route::delete('/sectors/{sector}', [SectorController::class, 'destroy']);

    // Users management (admin only, enforced in controller)
    Route::get('/users', [UserAdminController::class, 'index']);
    Route::put('/users/{user}', [UserAdminController::class, 'update']);

    // Issues
    Route::get('/issues', [IssueController::class, 'index']);
    Route::get('/issues/{issue}', [IssueController::class, 'show']);
    Route::post('/issues', [IssueController::class, 'store']);
    Route::patch('/issues/{issue}/status', [IssueController::class, 'updateStatus']);
});
