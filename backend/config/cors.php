<?php

return [
    'paths' => ['*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Allow local Vite dev servers to send/receive cookies with Sanctum
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'),
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:8080',
        'http://localhost:8080',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
