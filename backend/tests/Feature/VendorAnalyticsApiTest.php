<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Product;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class VendorAnalyticsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_can_fetch_analytics_data(): void
    {
        $vendorUser = User::factory()->create(['role' => 'vendor']);
        $vendor = VendorProfile::factory()->create([
            'user_id' => $vendorUser->id,
            'verification_status' => 'approved',
            'rating' => 4.7,
            'response_time_avg' => 2.5,
        ]);

        $product = Product::factory()->create([
            'vendor_id' => $vendor->id,
            'status' => 'active',
            'views_count' => 120,
        ]);

        Booking::factory()->create([
            'product_id' => $product->id,
            'vendor_id' => $vendor->id,
            'customer_id' => User::factory()->create(['role' => 'customer'])->id,
            'status' => 'completed',
            'total_amount' => 250.00,
            'platform_fee' => 7.50,
            'vendor_payment' => 242.50,
        ]);

        Sanctum::actingAs($vendorUser);

        $response = $this->getJson('/api/vendor/analytics');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'analytics' => [
                    'total_views',
                    'total_bookings',
                    'conversion_rate',
                    'average_rating',
                    'response_time',
                    'completion_rate',
                    'popular_products',
                    'booking_trends',
                ],
            ]);

        $this->assertSame(true, $response->json('success'));
    }
}
