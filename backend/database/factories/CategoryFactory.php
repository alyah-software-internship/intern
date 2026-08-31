<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Category>
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        $name = fake()->unique()->word() . ' rentals';

        return [
            'name' => $name,
            'name_am' => null,
            'slug' => str($name)->slug()->toString(),
            'description' => fake()->sentence(),
            'image_url' => fake()->imageUrl(640, 480, 'category', true),
            'parent_id' => null,
            'is_active' => true,
        ];
    }
}
