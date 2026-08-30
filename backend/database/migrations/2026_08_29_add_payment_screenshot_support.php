<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('payments', function (Blueprint $table) {
            // Add columns for manual payment methods (CBE, Telebirr)
            $table->text('payment_proof_path')->nullable()->after('payment_data');
            $table->string('payment_proof_type')->nullable()->after('payment_proof_path'); // 'screenshot', 'receipt', etc.
            $table->text('payment_remarks')->nullable()->after('payment_proof_type'); // Admin remarks
            $table->enum('proof_verification_status', ['pending', 'verified', 'rejected'])->default('pending')->after('payment_remarks');
            $table->timestamp('verified_at')->nullable()->after('proof_verification_status');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null')->after('verified_at');
        });
    }

    public function down()
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn([
                'payment_proof_path',
                'payment_proof_type',
                'payment_remarks',
                'proof_verification_status',
                'verified_at',
                'verified_by',
            ]);
        });
    }
};
