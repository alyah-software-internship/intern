<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('booking_id')->nullable()->change();
        });

        DB::statement("ALTER TABLE payments MODIFY payment_type ENUM('rental', 'security_deposit', 'operator', 'delivery', 'platform_fee', 'refund', 'subscription') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("UPDATE payments SET payment_type = 'platform_fee' WHERE payment_type = 'subscription'");
        DB::statement("ALTER TABLE payments MODIFY payment_type ENUM('rental', 'security_deposit', 'operator', 'delivery', 'platform_fee', 'refund') NOT NULL");

        Schema::table('payments', function (Blueprint $table) {
            $table->foreignId('booking_id')->nullable(false)->change();
        });
    }
};
