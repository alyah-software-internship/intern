<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('operator_availability', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operator_id')->constrained('operators')->onDelete('cascade');
            
            $table->date('date');
            $table->enum('status', ['available', 'booked', 'unavailable', 'holiday'])->default('available');
            $table->text('notes')->nullable();
            
            $table->timestamps();
            
            $table->unique(['operator_id', 'date']);
            $table->index('operator_id');
            $table->index('date');
            $table->index('status');
        });
    }

    public function down()
    {
        Schema::dropIfExists('operator_availability');
    }
};