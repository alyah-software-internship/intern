<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run(): void
    {
        // Don't truncate - use delete with condition or skip
        // Instead, check if user exists before inserting

        // Admin User
        DB::table('users')->updateOrInsert(
            ['email' => 'admin@ishare.com'],
            [
                'password' => Hash::make('Admin@123'),
                'first_name' => 'System',
                'middle_name' => 'Admin',
                'last_name' => 'User',
                'role' => 'admin',
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Vendor User
        DB::table('users')->updateOrInsert(
            ['email' => 'vendor@ishare.com'],
            [
                'password' => Hash::make('Vendor@123'),
                'first_name' => 'Abebe',
                'middle_name' => 'Kebede',
                'last_name' => 'Alemu',
                'first_name_am' => 'አበበ',
                'middle_name_am' => 'ከበደ',
                'last_name_am' => 'አለሙ',
                'role' => 'vendor',
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // Customer User
        DB::table('users')->updateOrInsert(
            ['email' => 'customer@ishare.com'],
            [
                'password' => Hash::make('Customer@123'),
                'first_name' => 'Tigist',
                'middle_name' => 'Hailu',
                'last_name' => 'Tesfaye',
                'first_name_am' => 'ጥግስት',
                'middle_name_am' => 'ኃይሉ',
                'last_name_am' => 'ተስፋዬ',
                'role' => 'customer',
                'is_active' => true,
                'email_verified_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}