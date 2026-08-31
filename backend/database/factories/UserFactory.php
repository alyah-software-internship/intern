<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();

        return [
            'first_name' => $firstName,
            'middle_name' => fake()->firstName(),
            'last_name' => $lastName,
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'password' => 'password',
            'email_verified_at' => now(),
            'role' => 'customer',
            'preferred_language' => 'en',
            'preferred_currency' => 'ETB',
            'timezone' => 'Africa/Addis_Ababa',
            'is_active' => true,
            'remember_token' => Str::random(10),
            'referral_code' => strtoupper(Str::random(8)),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
