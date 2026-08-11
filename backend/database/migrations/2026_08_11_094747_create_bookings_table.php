<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference', 50)->unique();
            
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('vendor_id')->constrained('vendor_profiles');
            $table->foreignId('operator_id')->nullable()->constrained('operators')->onDelete('set null');
            
            // Rental Details
            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->integer('rental_days')->default(1);
            $table->integer('rental_hours')->default(0);
            $table->enum('pricing_model', ['hourly', 'daily', 'weekly', 'monthly', 'flexible'])->default('daily');
            
            // Financial Breakdown
            $table->decimal('rental_amount', 10, 2);
            $table->decimal('operator_charge', 10, 2)->default(0.00);
            $table->decimal('security_deposit_amount', 10, 2)->default(0.00);
            $table->decimal('delivery_charge', 10, 2)->default(0.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->string('coupon_code', 50)->nullable();
            $table->decimal('platform_fee', 10, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2);
            $table->decimal('vendor_payment', 10, 2);
            $table->decimal('platform_commission', 10, 2)->default(0.00);
            $table->boolean('security_deposit_held')->default(true);
            
            // Status
            $table->enum('status', ['pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])->default('pending');
            $table->enum('security_deposit_status', ['pending', 'held', 'released', 'refunded', 'deducted'])->default('pending');
            $table->enum('operator_status', ['pending', 'assigned', 'confirmed', 'declined', 'completed'])->default('pending');
            
            // Payment
            $table->string('payment_method', 50)->nullable();
            $table->string('transaction_id', 255)->nullable();
            
            // Delivery
            $table->string('delivery_address', 500)->nullable();
            $table->string('delivery_address_am', 500)->nullable();
            
            // Additional Info
            $table->text('special_requests')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('booking_reference');
            $table->index('product_id');
            $table->index('customer_id');
            $table->index('vendor_id');
            $table->index('operator_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('security_deposit_status');
            $table->index('start_date');
            $table->index('end_date');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};