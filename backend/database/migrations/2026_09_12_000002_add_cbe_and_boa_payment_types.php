<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE vendor_payment_methods MODIFY payment_type ENUM('bank_transfer', 'mobile_money', 'paypal', 'stripe', 'chapa', 'telebirr', 'cbe', 'boa', 'other') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("UPDATE vendor_payment_methods SET payment_type = 'telebirr' WHERE payment_type IN ('cbe', 'boa')");
        DB::statement("ALTER TABLE vendor_payment_methods MODIFY payment_type ENUM('bank_transfer', 'mobile_money', 'paypal', 'stripe', 'chapa', 'telebirr', 'other') NOT NULL");
    }
};
