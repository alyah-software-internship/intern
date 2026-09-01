<?php

namespace App\Services\PaymentProviders;

use App\Contracts\PaymentProviderInterface;
use InvalidArgumentException;
use Illuminate\Support\Facades\Log;

class PaymentProviderFactory
{
    protected static $providers = [];

    /**
     * Get a payment provider instance
     */
    public static function make(string $provider = null): PaymentProviderInterface
    {
        $provider = $provider ?? config('services.payment.default', 'mock');

        if (!isset(static::$providers[$provider])) {
            static::$providers[$provider] = static::create($provider);
        }

        return static::$providers[$provider];
    }

    /**
     * Create a payment provider instance
     */
    protected static function create(string $provider): PaymentProviderInterface
    {
        return match ($provider) {
            'mock' => new MockPaymentProvider(),
            'stripe' => new StripePaymentProvider(),
            'chapa' => new ChapaPaymentProvider(),
            'telebirr' => new TelabirPaymentProvider(),
            default => throw new InvalidArgumentException("Unknown payment provider: {$provider}"),
        };
    }

    /**
     * Register a custom provider
     */
    public static function register(string $name, callable $callback): void
    {
        static::$providers[$name] = $callback();
    }

    /**
     * Clear provider cache
     */
    public static function flush(): void
    {
        static::$providers = [];
    }
}
