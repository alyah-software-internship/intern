<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vendor_profiles', function (Blueprint $table) {
            $table->id();

            // User who owns this vendor profile
            $table->foreignId('user_id')
                ->unique()
                ->constrained('users')
                ->cascadeOnDelete();

            // Business information
            $table->string('business_name', 200);
            $table->string('business_name_am', 200)->nullable();

            $table->text('business_description')->nullable();
            $table->text('business_description_am')->nullable();

            $table->string('business_type', 100)->nullable();

            $table->string('business_registration_number', 100)
                ->nullable();

            $table->string('tax_identification_number', 100)
                ->nullable();

            // Contact
            $table->string('business_phone', 50)->nullable();
            $table->string('business_email')->nullable();
            $table->string('website', 500)->nullable();

            // Logo
            $table->string('logo_url', 500)->nullable();

            // Address
            $table->string('address', 500)->nullable();
            $table->string('address_am', 500)->nullable();

            $table->string('city', 100)->nullable();
            $table->string('city_am', 100)->nullable();

            $table->string('country', 100)
                ->default('Ethiopia');

            $table->string('postal_code', 20)->nullable();

            // Verification
            $table->enum('verification_status', [
                'pending',
                'under_review',
                'verified',
                'rejected'
            ])->default('pending');

            $table->timestamp('verified_at')->nullable();

            $table->foreignId('verified_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->text('verification_notes')->nullable();

            // Statistics
            $table->decimal('rating', 3, 2)
                ->default(0.00);

            $table->integer('total_reviews')->default(0);
            $table->integer('total_products')->default(0);
            $table->integer('total_bookings')->default(0);

            $table->decimal('total_earnings', 12, 2)
                ->default(0.00);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Indexes
            $table->index('verification_status');
            $table->index('city');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendor_profiles');
    }
};