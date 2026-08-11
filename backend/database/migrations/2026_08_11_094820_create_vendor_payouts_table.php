<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vendor_payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendor_profiles')->onDelete('cascade');
            $table->foreignId('payment_method_id')->constrained('vendor_payment_methods')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            
            $table->decimal('amount', 10, 2);
            $table->decimal('platform_commission', 10, 2)->default(0.00);
            $table->decimal('net_amount', 10, 2);
            
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled'])->default('pending');
            $table->string('transaction_id', 255)->nullable();
            $table->string('reference_number', 100)->nullable();
            $table->decimal('processing_fee', 10, 2)->default(0.00);
            $table->text('notes')->nullable();
            
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            $table->index('vendor_id');
            $table->index('payment_method_id');
            $table->index('booking_id');
            $table->index('status');
            $table->index('transaction_id');
            $table->index('reference_number');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('vendor_payouts');
    }
};