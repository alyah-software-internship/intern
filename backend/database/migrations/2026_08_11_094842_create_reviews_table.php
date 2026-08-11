<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->constrained('bookings');
            $table->foreignId('product_id')->constrained('products');
            $table->foreignId('customer_id')->constrained('users');
            $table->foreignId('vendor_id')->constrained('vendor_profiles');
            
            $table->integer('rating')->unsigned()->check('rating BETWEEN 1 AND 5');
            $table->string('title', 255)->nullable();
            $table->text('comment')->nullable();
            $table->text('comment_am')->nullable();
            $table->json('images')->nullable();
            
            $table->boolean('is_verified_purchase')->default(true);
            $table->boolean('is_approved')->default(true);
            $table->integer('reported_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique('booking_id');
            $table->index('product_id');
            $table->index('customer_id');
            $table->index('vendor_id');
            $table->index('rating');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
    }
};