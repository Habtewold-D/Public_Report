<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('private-user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('private-sector.{sectorId}', function ($user, $sectorId) {
    return (int) $user->id === (int) $sectorId && $user->role === 'sector';
});
