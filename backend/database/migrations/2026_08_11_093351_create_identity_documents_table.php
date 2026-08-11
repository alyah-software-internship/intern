<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('identity_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            $table->enum('document_type', ['national_id', 'passport', 'drivers_license', 'voter_id', 'other']);
            $table->string('document_number', 100);
            $table->string('document_country', 100)->default('Ethiopia');
            $table->date('document_issue_date')->nullable();
            $table->date('document_expiry_date')->nullable();
            
            $table->string('document_front_url', 500);
            $table->string('document_back_url', 500)->nullable();
            $table->string('selfie_with_document_url', 500)->nullable();
            
            $table->enum('verification_status', ['pending', 'under_review', 'verified', 'rejected', 'expired'])->default('pending');
            $table->text('verification_notes')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            
            $table->boolean('is_primary')->default(false);
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['user_id', 'document_type']);
            $table->index('user_id');
            $table->index('document_type');
            $table->index('verification_status');
            $table->index('document_number');
            $table->index('is_primary');
        });
    }

    public function down()
    {
        Schema::dropIfExists('identity_documents');
    }
};