<?php

namespace App\Services\PaymentProviders;

use App\Contracts\PaymentProviderInterface;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MockPaymentProvider implements PaymentProviderInterface
{
    protected $baseUrl;
    protected $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('services.payment.mock.base_url', 'https://mock-payment.local');
        $this->apiKey = config('services.payment.mock.api_key', 'mock-api-key');
    }

    /**
     * Initialize a payment transaction
     */
    public function initiate(
        string $reference,
        float $amount,
        string $currency,
        string $description,
        array $customerData,
        array $metadata = []
    ): array {
        Log::info('Mock payment initiated', [
            'reference' => $reference,
            'amount' => $amount,
            'currency' => $currency,
        ]);

        $providerReference = 'MOCK-' . strtoupper(Str::random(16));
        $paymentToken = 'TOKEN-' . strtoupper(Str::random(20));

        return [
            'success' => true,
            'provider_reference' => $providerReference,
            'payment_token' => $paymentToken,
            'redirect_url' => $this->baseUrl . '/pay?token=' . $paymentToken,
            'payment_url' => $this->baseUrl . '/pay?token=' . $paymentToken,
            'expires_at' => now()->addMinutes(30)->toIso8601String(),
            'metadata' => [
                'reference' => $reference,
                'amount' => $amount,
                'currency' => $currency,
            ],
        ];
    }

    /**
     * Verify payment with the provider
     */
    public function verify(
        string $reference,
        string $providerReference,
        string $transactionId
    ): array {
        Log::info('Mock payment verification', [
            'reference' => $reference,
            'provider_reference' => $providerReference,
            'transaction_id' => $transactionId,
        ]);

        // In a real scenario, this would call the payment provider's API
        // For now, we'll simulate a successful payment
        return [
            'success' => true,
            'status' => 'paid',
            'provider_reference' => $providerReference,
            'transaction_id' => $transactionId,
            'verified' => true,
            'verified_at' => now()->toIso8601String(),
            'message' => 'Payment verified successfully',
        ];
    }

    /**
     * Process refund with the provider
     */
    public function refund(
        string $providerReference,
        float $amount,
        string $reason = '',
        array $metadata = []
    ): array {
        Log::info('Mock refund initiated', [
            'provider_reference' => $providerReference,
            'amount' => $amount,
            'reason' => $reason,
        ]);

        $refundReference = 'REFUND-' . strtoupper(Str::random(16));

        return [
            'success' => true,
            'refund_reference' => $refundReference,
            'status' => 'processing',
            'amount' => $amount,
            'provider_reference' => $providerReference,
            'original_transaction_id' => $providerReference,
            'message' => 'Refund initiated successfully',
        ];
    }

    /**
     * Check payment status
     */
    public function checkStatus(string $providerReference): array
    {
        Log::info('Mock status check', [
            'provider_reference' => $providerReference,
        ]);

        return [
            'success' => true,
            'status' => 'paid',
            'provider_reference' => $providerReference,
            'message' => 'Payment status retrieved',
        ];
    }

    /**
     * Validate webhook signature
     */
    public function validateWebhookSignature(
        string $payload,
        string $signature
    ): bool {
        // In a real implementation, this would validate the HMAC signature
        // For mock, we'll always return true
        Log::info('Mock webhook validation', [
            'signature' => substr($signature, 0, 10) . '...',
        ]);

        return true;
    }

    /**
     * Parse webhook payload
     */
    public function parseWebhookPayload(string $payload): array
    {
        Log::info('Mock webhook payload parsing');

        $data = json_decode($payload, true);

        return [
            'success' => true,
            'event_type' => $data['event_type'] ?? 'payment.completed',
            'provider_reference' => $data['provider_reference'] ?? null,
            'transaction_id' => $data['transaction_id'] ?? null,
            'status' => $data['status'] ?? 'paid',
            'amount' => $data['amount'] ?? null,
            'currency' => $data['currency'] ?? 'ETB',
            'reference' => $data['reference'] ?? null,
            'metadata' => $data['metadata'] ?? [],
        ];
    }

    /**
     * Get provider name
     */
    public function getProviderName(): string
    {
        return 'mock';
    }
}
