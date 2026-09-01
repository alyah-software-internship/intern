<?php

namespace App\Contracts;

interface PaymentProviderInterface
{
    /**
     * Initialize a payment transaction
     * Returns payment initialization data (redirect URL, token, etc.)
     */
    public function initiate(
        string $reference,
        float $amount,
        string $currency,
        string $description,
        array $customerData,
        array $metadata = []
    ): array;

    /**
     * Verify payment with the provider
     * Returns payment verification result
     */
    public function verify(
        string $reference,
        string $providerReference,
        string $transactionId
    ): array;

    /**
     * Process refund with the provider
     */
    public function refund(
        string $providerReference,
        float $amount,
        string $reason = '',
        array $metadata = []
    ): array;

    /**
     * Check payment status
     */
    public function checkStatus(string $providerReference): array;

    /**
     * Validate webhook signature
     */
    public function validateWebhookSignature(
        string $payload,
        string $signature
    ): bool;

    /**
     * Parse webhook payload
     */
    public function parseWebhookPayload(string $payload): array;

    /**
     * Get provider name
     */
    public function getProviderName(): string;
}
