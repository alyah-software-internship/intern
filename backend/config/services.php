<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // ========== PAYMENT CONFIGURATION ==========
    'payment' => [
        'default' => env('PAYMENT_PROVIDER', 'mock'),
        
        'mock' => [
            'base_url' => env('MOCK_PAYMENT_BASE_URL', 'https://mock-payment.local'),
            'api_key' => env('MOCK_PAYMENT_API_KEY', 'mock-api-key'),
        ],
        
        'stripe' => [
            'api_key' => env('STRIPE_API_KEY'),
            'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
        ],
        
        'chapa' => [
            'api_key' => env('CHAPA_API_KEY'),
            'webhook_key' => env('CHAPA_WEBHOOK_KEY'),
        ],
        
        'telebirr' => [
            'api_key' => env('TELEBIRR_API_KEY'),
            'merchant_id' => env('TELEBIRR_MERCHANT_ID'),
        ],
    ],

];
