<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('identity_documents', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->enum('document_type', [
                'national_id',
                'passport',
                'drivers_license',
                'other'
            ]);

            $table->string('document_number', 100);

            $table->string('document_front_url', 500)->nullable();
            $table->string('document_back_url', 500)->nullable();

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

            $table->timestamps();

            $table->index('user_id');
            $table->index('document_type');
            $table->index('verification_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('identity_documents');
    }
};