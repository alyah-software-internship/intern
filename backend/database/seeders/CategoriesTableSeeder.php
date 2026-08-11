<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Construction & Tools',
                'name_am' => 'ግንባታ እና መሳሪያዎች',
                'slug' => 'construction-tools',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Agriculture & Tractors',
                'name_am' => 'ግብርና እና ትራክተሮች',
                'slug' => 'agriculture-tractors',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Commercial Vehicles',
                'name_am' => 'የንግድ ተሽከርካሪዎች',
                'slug' => 'commercial-vehicles',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Beauty & Wellness',
                'name_am' => 'ውበት እና ጤና',
                'slug' => 'beauty-wellness',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Events & Parties',
                'name_am' => 'ዝግጅቶች እና ፓርቲዎች',
                'slug' => 'events-parties',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Electronics & Gadgets',
                'name_am' => 'ኤሌክትሮኒክስ እና መሳሪያዎች',
                'slug' => 'electronics-gadgets',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sports & Fitness',
                'name_am' => 'ስፖርት እና አካል ብቃት',
                'slug' => 'sports-fitness',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Home & Garden',
                'name_am' => 'ቤት እና አትክልት',
                'slug' => 'home-garden',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($categories as $category) {
            // Use updateOrInsert to avoid duplicates
            DB::table('categories')->updateOrInsert(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}