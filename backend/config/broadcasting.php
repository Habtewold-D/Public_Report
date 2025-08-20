<?php

return [
    'default' => env('BROADCAST_DRIVER', 'log'),

    'connections' => [
        'pusher' => [
            'driver' => 'pusher',
            'key' => env('PUSHER_APP_KEY'),
            'secret' => env('PUSHER_APP_SECRET'),
            'app_id' => env('PUSHER_APP_ID'),
            // Only include non-empty options. Empty host/port/scheme can break URL building (https://:443)
            'options' => array_filter([
                'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
                // Support both env names
                'useTLS' => env('PUSHER_USE_TLS', env('PUSHER_APP_USE_TLS', true)),
                'host' => env('PUSHER_HOST'),
                'port' => env('PUSHER_PORT'),
                'scheme' => env('PUSHER_SCHEME'),
            ], function ($v) {
                return !is_null($v) && $v !== '';
            }),
        ],

        'log' => [
            'driver' => 'log',
        ],

        'null' => [
            'driver' => 'null',
        ],
    ],
];
