<?php

use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

Broadcast::channel('private-user.{userId}', function ($user, $userId) {
    $allowed = (int) $user->id === (int) $userId || $user->role === 'admin';
    Log::info('Broadcast auth private-user', [
        'auth_user_id' => $user->id,
        'auth_role' => $user->role ?? null,
        'param_user_id' => (int) $userId,
        'allowed' => $allowed,
    ]);
    return $allowed;
});

Broadcast::channel('private-sector.{sectorId}', function ($user, $sectorId) {
    $allowed = ((int) $user->id === (int) $sectorId && $user->role === 'sector') || $user->role === 'admin';
    Log::info('Broadcast auth private-sector', [
        'auth_user_id' => $user->id,
        'auth_role' => $user->role ?? null,
        'param_sector_id' => (int) $sectorId,
        'allowed' => $allowed,
    ]);
    return $allowed;
});
