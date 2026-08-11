<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            
            $table->string('image_url', 500);
            $table->string('alt_text', 255)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('product_id');
            $table->index('is_primary');
            $table->unique(['product_id', 'sort_order']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_images');
    }
};