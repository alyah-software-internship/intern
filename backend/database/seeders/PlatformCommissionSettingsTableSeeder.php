<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlatformCommissionSettingsTableSeeder extends Seeder
{
    public function run(): void
    {
        $exists = DB::table('platform_commission_settings')->exists();
        
        if (!$exists) {
            DB::table('platform_commission_settings')->insert([
                'commission_type' => 'percentage',
                'commission_value' => 10.00,
                'min_commission' => 0.00,
                'max_commission' => 0.00,
                'applies_to' => 'all',
                'currency' => 'USD',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}