<?php

namespace App\Services\PaymentProviders;

use App\Contracts\PaymentProviderInterface;

class ChapaPaymentProvider implements PaymentProviderInterface
{
    protected $apiKey;
    protected $webhookKey;

    public function __construct()
    {
        $this->apiKey = config('services.payment.chapa.api_key');
        $this->webhookKey = config('services.payment.chapa.webhook_key');
    }

    public function initiate(
        string $reference,
        float $amount,
        string $currency,
        string $description,
        array $customerData,
        array $metadata = []
    ): array {
        // TODO: Implement Chapa payment initiation
        throw new \Exception('Chapa payment provider not yet implemented');
    }

    public function verify(
        string $reference,
        string $providerReference,
        string $transactionId
    ): array {
        // TODO: Implement Chapa payment verification
        throw new \Exception('Chapa payment provider not yet implemented');
    }

    public function refund(
        string $providerReference,
        float $amount,
        string $reason = '',
        array $metadata = []
    ): array {
        // TODO: Implement Chapa refund
        throw new \Exception('Chapa payment provider not yet implemented');
    }

    public function checkStatus(string $providerReference): array
    {
        // TODO: Implement Chapa status check
        throw new \Exception('Chapa payment provider not yet implemented');
    }

    public function validateWebhookSignature(
        string $payload,
        string $signature
    ): bool {
        // TODO: Implement Chapa webhook validation
        return false;
    }

    public function parseWebhookPayload(string $payload): array
    {
        // TODO: Implement Chapa webhook parsing
        return [];
    }

    public function getProviderName(): string
    {
        return 'chapa';
    }
}
