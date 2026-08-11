<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('name_am', 255)->nullable();
            $table->string('slug', 255)->unique();
            $table->string('image_url', 500)->nullable();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('parent_id');
            $table->index('is_active');
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
};