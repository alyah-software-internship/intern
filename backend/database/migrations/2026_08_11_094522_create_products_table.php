<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendor_profiles')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories');
            
            // Product Information
            $table->string('name', 255);
            $table->string('name_am', 255)->nullable();
            $table->string('slug', 255)->unique();
            $table->text('description')->nullable();
            $table->text('description_am')->nullable();
            
            // Pricing Model
            $table->enum('pricing_model', ['hourly', 'daily', 'weekly', 'monthly', 'flexible'])->default('daily');
            $table->decimal('price_hourly', 10, 2)->default(0.00);
            $table->decimal('price_daily', 10, 2)->default(0.00);
            $table->decimal('price_weekly', 10, 2)->default(0.00);
            $table->decimal('price_monthly', 10, 2)->default(0.00);
            $table->decimal('price_flexible', 10, 2)->default(0.00);
            
            // Security Deposit
            $table->enum('security_deposit_type', ['percentage', 'fixed'])->default('fixed');
            $table->decimal('security_deposit_amount', 10, 2)->default(0.00);
            $table->decimal('security_deposit_percentage', 5, 2)->default(0.00);
            $table->boolean('security_deposit_held')->default(true);
            $table->integer('security_deposit_refund_days')->default(3);
            
            // Operator Settings
            $table->boolean('operator_required')->default(false);
            $table->boolean('operator_included')->default(false);
            $table->enum('operator_charge_type', ['hourly', 'daily', 'weekly', 'monthly', 'fixed'])->default('daily');
            $table->decimal('operator_charge_amount', 10, 2)->default(0.00);
            
            // Inventory
            $table->integer('quantity')->default(1);
            
            // Status
            $table->enum('status', ['active', 'inactive', 'pending', 'suspended'])->default('pending');
            $table->enum('availability_status', ['available', 'unavailable', 'booked', 'maintenance'])->default('available');
            $table->boolean('is_featured')->default(false);
            
            // Stats
            $table->integer('views_count')->default(0);
            $table->decimal('rating', 3, 2)->default(0.00);
            $table->integer('total_reviews')->default(0);
            
            // Additional Data
            $table->json('specifications')->nullable();
            $table->json('rental_policies')->nullable();
            $table->boolean('delivery_available')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Fulltext Indexes
            $table->fullText(['name', 'description', 'name_am', 'description_am'], 'idx_search');
            
            $table->index('vendor_id');
            $table->index('category_id');
            $table->index('status');
            $table->index('availability_status');
            $table->index('rating');
            $table->index('price_daily');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};