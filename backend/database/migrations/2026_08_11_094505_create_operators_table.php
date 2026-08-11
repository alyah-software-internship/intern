<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('operators', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendor_profiles')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Personal Information
            $table->string('full_name', 255);
            $table->string('full_name_am', 255)->nullable();
            $table->string('phone', 50);
            $table->string('email', 255)->nullable();
            $table->text('address')->nullable();
            $table->string('specialization', 255)->nullable();
            $table->string('specialization_am', 255)->nullable();
            $table->integer('experience_years')->default(0);
            
            // Rates
            $table->decimal('hourly_rate', 10, 2)->default(0.00);
            $table->decimal('daily_rate', 10, 2)->default(0.00);
            $table->decimal('weekly_rate', 10, 2)->default(0.00);
            $table->decimal('monthly_rate', 10, 2)->default(0.00);
            
            // Status & Verification
            $table->boolean('is_active')->default(true);
            $table->boolean('is_verified')->default(false);
            $table->enum('verification_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            
            // Documents
            $table->string('certification_url', 500)->nullable();
            $table->string('id_document_url', 500)->nullable();
            $table->string('profile_image_url', 500)->nullable();
            $table->text('bio')->nullable();
            
            // Ratings
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_assignments')->default(0);
            
            // Availability
            $table->enum('available_status', ['available', 'busy', 'on_leave', 'unavailable'])->default('available');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['vendor_id', 'is_active']);
            $table->index('user_id');
            $table->index('verification_status');
            $table->index('available_status');
            $table->index('phone');
        });
    }

    public function down()
    {
        Schema::dropIfExists('operators');
    }
};