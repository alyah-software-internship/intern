<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('vendor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Business Information
            $table->string('business_name', 255);
            $table->string('business_name_am', 255)->nullable();
            $table->string('business_type', 100)->nullable();
            $table->string('business_type_am', 100)->nullable();
            $table->text('description')->nullable();
            $table->text('description_am')->nullable();
            
            // Address
            $table->string('address', 500)->nullable();
            $table->string('address_am', 500)->nullable();
            $table->string('city', 100)->nullable();
            $table->string('city_am', 100)->nullable();
            $table->string('country', 100)->default('Ethiopia');
            $table->string('postal_code', 20)->nullable();
            
            // Contact
            $table->string('phone', 50)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('website', 255)->nullable();
            
            // Branding
            $table->string('logo_url', 500)->nullable();
            $table->string('cover_image_url', 500)->nullable();
            
            // Business Documents
            $table->string('tax_id', 100)->nullable();
            $table->string('registration_number', 100)->nullable();
            
            // Verification
            $table->enum('verification_status', ['pending', 'under_review', 'approved', 'rejected', 'suspended'])->default('pending');
            $table->boolean('identity_verified')->default(false);
            $table->timestamp('identity_verified_at')->nullable();
            $table->timestamp('verification_approved_at')->nullable();
            $table->boolean('payment_methods_verified')->default(false);
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            
            // Stats
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            $table->integer('total_bookings')->default(0);
            $table->decimal('total_revenue', 10, 2)->default(0.00);
            $table->decimal('pending_payouts', 10, 2)->default(0.00);
            $table->decimal('security_deposit_held', 10, 2)->default(0.00);
            $table->decimal('response_time_avg', 5, 2)->default(0.00);
            
            $table->date('joined_date')->nullable();
            $table->integer('completed_projects')->default(0);
            $table->integer('trust_score')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('user_id');
            $table->index('verification_status');
            $table->index('is_active');
            $table->index('city');
        });
    }

    public function down()
    {
        Schema::dropIfExists('vendor_profiles');
    }
};