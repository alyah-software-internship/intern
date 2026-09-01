<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('professional_title', 255)->nullable();
            $table->unsignedInteger('experience_years')->default(0);
            $table->text('professional_bio')->nullable();
            $table->text('skills')->nullable();
            $table->string('cv_url', 500)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'professional_title',
                'experience_years',
                'professional_bio',
                'skills',
                'cv_url',
            ]);
        });
    }
};
