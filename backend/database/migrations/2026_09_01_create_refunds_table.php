<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payment_id')->constrained('payments')->onDelete('cascade');
            $table->foreignId('booking_id')->constrained('bookings')->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('vendor_id')->nullable()->constrained('vendor_profiles')->onDelete('set null');
            
            $table->decimal('amount', 12, 2);
            $table->enum('reason', [
                'booking_cancelled',
                'booking_not_completed',
                'customer_request',
                'dispute_resolved',
                'damaged_item',
                'late_return',
                'other'
            ])->default('other');
            
            $table->enum('status', ['pending', 'processing', 'completed', 'failed'])->default('pending');
            $table->string('provider_reference')->nullable()->unique();
            $table->timestamp('processed_at')->nullable();
            $table->text('refund_notes')->nullable();
            
            $table->foreignId('initiated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
            
            // Indexes
            $table->index('payment_id');
            $table->index('booking_id');
            $table->index('customer_id');
            $table->index('vendor_id');
            $table->index('status');
            $table->index('created_at');
            $table->index('provider_reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};
