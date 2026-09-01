<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Add provider reference for duplicate payment protection
            if (!Schema::hasColumn('payments', 'provider_reference')) {
                $table->string('provider_reference')->nullable()->unique()->after('transaction_id');
            }
            
            // Add platform fee and vendor amount breakdown
            if (!Schema::hasColumn('payments', 'platform_fee')) {
                $table->decimal('platform_fee', 12, 2)->default(0)->after('amount');
            }
            
            if (!Schema::hasColumn('payments', 'vendor_amount')) {
                $table->decimal('vendor_amount', 12, 2)->default(0)->after('platform_fee');
            }
            
            // Add failed timestamp for tracking failed payments
            if (!Schema::hasColumn('payments', 'failed_at')) {
                $table->timestamp('failed_at')->nullable()->after('completed_at');
            }
            
            // Add paid_at if not exists
            if (!Schema::hasColumn('payments', 'paid_at')) {
                $table->timestamp('paid_at')->nullable()->after('failed_at');
            }
            
            // Add payment status extended
            if (!Schema::hasColumn('payments', 'payment_status')) {
                $table->enum('payment_status', ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'])->default('pending')->after('status');
            }
            
            // Add idempotency key for webhook safety
            if (!Schema::hasColumn('payments', 'idempotency_key')) {
                $table->string('idempotency_key')->nullable()->unique()->after('provider_reference');
            }
            
            // Add webhook verification fields
            if (!Schema::hasColumn('payments', 'webhook_verified')) {
                $table->boolean('webhook_verified')->default(false)->after('idempotency_key');
            }
            
            if (!Schema::hasColumn('payments', 'webhook_verified_at')) {
                $table->timestamp('webhook_verified_at')->nullable()->after('webhook_verified');
            }
            
            // Add index for provider reference to enable quick lookups
            $table->index('provider_reference');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropUnique('payments_provider_reference_unique');
            $table->dropUnique('payments_idempotency_key_unique');
            $table->dropColumn([
                'provider_reference',
                'platform_fee',
                'vendor_amount',
                'failed_at',
                'paid_at',
                'payment_status',
                'idempotency_key',
                'webhook_verified',
                'webhook_verified_at',
            ]);
        });
    }
};
