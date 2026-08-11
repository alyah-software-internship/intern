<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vendor_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendor_profiles')->onDelete('cascade');
            
            $table->enum('payment_type', ['bank_transfer', 'mobile_money', 'paypal', 'stripe', 'chapa', 'telebirr', 'other']);
            $table->string('account_name', 255);
            $table->string('account_number', 100);
            $table->string('bank_name', 255)->nullable();
            $table->string('bank_branch', 255)->nullable();
            $table->string('swift_code', 50)->nullable();
            $table->string('mobile_provider', 100)->nullable();
            $table->string('mobile_number', 50)->nullable();
            $table->string('paypal_email', 255)->nullable();
            $table->string('stripe_account_id', 255)->nullable();
            $table->string('chapa_account_id', 255)->nullable();
            
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_active')->default(true);
            
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->text('verification_notes')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['vendor_id', 'is_primary']);
            $table->index(['vendor_id', 'verification_status']);
            $table->index('account_number');
        });
    }

    public function down()
    {
        Schema::dropIfExists('vendor_payment_methods');
    }
};