<?php

namespace Database\Factories;

use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<VendorProfile>
 */
class VendorProfileFactory extends Factory
{
    protected $model = VendorProfile::class;

    public function definition(): array
    {
        $businessName = fake()->company();

        return [
            'user_id' => null,
            'business_name' => $businessName,
            'business_name_am' => null,
            'business_type' => 'Rental Services',
            'business_type_am' => null,
            'description' => fake()->sentence(),
            'description_am' => null,
            'address' => fake()->streetAddress(),
            'address_am' => null,
            'city' => fake()->city(),
            'city_am' => null,
            'country' => 'Ethiopia',
            'postal_code' => fake()->postcode(),
            'phone' => fake()->phoneNumber(),
            'email' => fake()->safeEmail(),
            'website' => fake()->url(),
            'logo_url' => null,
            'cover_image_url' => null,
            'tax_id' => fake()->numerify('TAX####'),
            'registration_number' => fake()->bothify('REG-####'),
            'verification_status' => 'approved',
            'identity_verified' => true,
            'identity_verified_at' => now(),
            'verification_approved_at' => now(),
            'payment_methods_verified' => true,
            'is_active' => true,
            'is_featured' => false,
            'rating' => 4.8,
            'total_reviews' => 0,
            'total_bookings' => 0,
            'total_revenue' => 0,
            'pending_payouts' => 0,
            'security_deposit_held' => 0,
            'response_time_avg' => 1.5,
            'joined_date' => now()->toDateString(),
            'completed_projects' => 0,
            'trust_score' => 90,
        ];
    }
}
