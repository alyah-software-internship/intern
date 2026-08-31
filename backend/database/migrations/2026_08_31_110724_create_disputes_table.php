<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained()->onDelete('cascade');
            $table->foreignId('security_deposit_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('complainant_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('respondent_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->longText('description');
            $table->enum('status', ['open', 'in_progress', 'resolved', 'closed', 'rejected'])->default('open');
            $table->enum('reason', ['damage', 'non_return', 'quality_issue', 'payment_dispute', 'other'])->default('other');
            $table->longText('resolution_notes')->nullable();
            $table->longText('admin_notes')->nullable();
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('resolved_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('booking_id');
            $table->index('complainant_id');
            $table->index('respondent_id');
            $table->index('assigned_to');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
