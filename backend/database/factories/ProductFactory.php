<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(3, true);

        return [
            'vendor_id' => VendorProfile::factory(),
            'category_id' => Category::factory(),
            'name' => $name,
            'name_am' => null,
            'slug' => str($name)->slug()->append('-' . rand(1000, 9999))->toString(),
            'description' => fake()->paragraph(),
            'description_am' => null,
            'pricing_model' => 'daily',
            'price_hourly' => 25.00,
            'price_daily' => 90.00,
            'price_weekly' => 500.00,
            'price_monthly' => 1800.00,
            'price_flexible' => 120.00,
            'security_deposit_type' => 'fixed',
            'security_deposit_amount' => 50.00,
            'security_deposit_percentage' => 0.00,
            'security_deposit_held' => true,
            'security_deposit_refund_days' => 3,
            'operator_required' => false,
            'operator_included' => false,
            'operator_charge_type' => 'daily',
            'operator_charge_amount' => 0.00,
            'quantity' => 1,
            'status' => 'active',
            'availability_status' => 'available',
            'is_featured' => false,
            'views_count' => 0,
            'rating' => 4.9,
            'total_reviews' => 0,
            'specifications' => [],
            'rental_policies' => [],
            'delivery_available' => false,
        ];
    }
}
