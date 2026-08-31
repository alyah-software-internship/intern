<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->text('verification_notes')->nullable()->after('verification_status');
            $table->timestamp('verified_at')->nullable()->after('verification_notes');
            $table->text('suspension_reason')->nullable()->after('is_active');
            $table->timestamp('suspended_at')->nullable()->after('suspension_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vendor_profiles', function (Blueprint $table) {
            $table->dropColumn(['verification_notes', 'verified_at', 'suspension_reason', 'suspended_at']);
        });
    }
};
