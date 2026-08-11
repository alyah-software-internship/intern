<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('security_deposits', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings');
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('vendor_id')->constrained('vendor_profiles');
            
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'held', 'released', 'refunded', 'deducted', 'disputed'])->default('pending');
            
            $table->string('payment_transaction_id', 255)->nullable();
            $table->string('release_transaction_id', 255)->nullable();
            $table->string('refund_transaction_id', 255)->nullable();
            
            $table->timestamp('held_at')->nullable();
            $table->timestamp('released_at')->nullable();
            $table->timestamp('refunded_at')->nullable();
            
            $table->decimal('deducted_amount', 10, 2)->default(0);
            $table->text('deduction_reason')->nullable();
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            $table->unique('booking_id');
            $table->index('booking_id');
            $table->index('customer_id');
            $table->index('vendor_id');
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('security_deposits');
    }
};