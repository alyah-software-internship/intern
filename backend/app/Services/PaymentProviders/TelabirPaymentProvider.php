<?php

namespace App\Services\PaymentProviders;

use App\Contracts\PaymentProviderInterface;

class TelabirPaymentProvider implements PaymentProviderInterface
{
    protected $apiKey;
    protected $merchantId;

    public function __construct()
    {
        $this->apiKey = config('services.payment.telebirr.api_key');
        $this->merchantId = config('services.payment.telebirr.merchant_id');
    }

    public function initiate(
        string $reference,
        float $amount,
        string $currency,
        string $description,
        array $customerData,
        array $metadata = []
    ): array {
        // TODO: Implement Telebirr payment initiation
        throw new \Exception('Telebirr payment provider not yet implemented');
    }

    public function verify(
        string $reference,
        string $providerReference,
        string $transactionId
    ): array {
        // TODO: Implement Telebirr payment verification
        throw new \Exception('Telebirr payment provider not yet implemented');
    }

    public function refund(
        string $providerReference,
        float $amount,
        string $reason = '',
        array $metadata = []
    ): array {
        // TODO: Implement Telebirr refund
        throw new \Exception('Telebirr payment provider not yet implemented');
    }

    public function checkStatus(string $providerReference): array
    {
        // TODO: Implement Telebirr status check
        throw new \Exception('Telebirr payment provider not yet implemented');
    }

    public function validateWebhookSignature(
        string $payload,
        string $signature
    ): bool {
        // TODO: Implement Telebirr webhook validation
        return false;
    }

    public function parseWebhookPayload(string $payload): array
    {
        // TODO: Implement Telebirr webhook parsing
        return [];
    }

    public function getProviderName(): string
    {
        return 'telebirr';
    }
}
