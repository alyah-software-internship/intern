<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings');
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('vendor_id')->nullable()->constrained('vendor_profiles')->onDelete('set null');
            
            $table->decimal('amount', 10, 2);
            $table->enum('payment_type', ['rental', 'security_deposit', 'operator', 'delivery', 'platform_fee', 'refund']);
            $table->string('payment_method', 50);
            $table->string('transaction_id', 255)->unique();
            
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');
            $table->json('payment_data')->nullable();
            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->string('refund_transaction_id', 255)->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            $table->index('booking_id');
            $table->index('user_id');
            $table->index('vendor_id');
            $table->index('transaction_id');
            $table->index('payment_type');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('payments');
    }
};