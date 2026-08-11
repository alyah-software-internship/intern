<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('platform_commission_settings', function (Blueprint $table) {
            $table->id();
            $table->enum('commission_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('commission_value', 10, 2);
            $table->decimal('min_commission', 10, 2)->default(0);
            $table->decimal('max_commission', 10, 2)->default(0);
            $table->enum('applies_to', ['all', 'hourly', 'daily', 'weekly', 'monthly'])->default('all');
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('platform_commission_settings');
    }
};