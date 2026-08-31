<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Product;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition(): array
    {
        $startDate = fake()->dateTimeBetween('now', '+10 days');
        $endDate = (clone $startDate)->modify('+2 days');
        $rentalAmount = 150.00;
        $totalAmount = 180.00;

        return [
            'booking_reference' => 'BK-' . strtoupper(fake()->bothify('#######')),
            'product_id' => Product::factory(),
            'customer_id' => User::factory()->create(['role' => 'customer'])->id,
            'vendor_id' => VendorProfile::factory(),
            'operator_id' => null,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'rental_days' => 2,
            'rental_hours' => 0,
            'pricing_model' => 'daily',
            'rental_amount' => $rentalAmount,
            'operator_charge' => 0.00,
            'security_deposit_amount' => 30.00,
            'delivery_charge' => 0.00,
            'discount_amount' => 0.00,
            'coupon_code' => null,
            'platform_fee' => 10.00,
            'total_amount' => $totalAmount,
            'vendor_payment' => $totalAmount,
            'platform_commission' => 10.00,
            'security_deposit_held' => true,
            'status' => 'confirmed',
            'payment_status' => 'paid',
            'security_deposit_status' => 'held',
            'operator_status' => 'pending',
            'payment_method' => 'cash',
            'transaction_id' => 'txn_' . fake()->numerify('######'),
            'delivery_address' => fake()->address(),
            'delivery_address_am' => null,
            'special_requests' => null,
            'cancellation_reason' => null,
            'cancelled_at' => null,
            'completed_at' => null,
        ];
    }
}
