<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('product_operator_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->foreignId('operator_id')->constrained('operators')->onDelete('cascade');
            
            $table->boolean('is_primary')->default(false);
            $table->boolean('is_active')->default(true);
            $table->date('assignment_date')->nullable();
            
            $table->timestamps();
            
            $table->unique(['product_id', 'operator_id']);
            $table->index('product_id');
            $table->index('operator_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('product_operator_assignments');
    }
};