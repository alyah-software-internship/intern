<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Dispute;
use App\Models\Product;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminMediationCasesApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_mediation_cases_endpoint_returns_dispute_records(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
        ]);

        $vendorUser = User::factory()->create([
            'role' => 'vendor',
            'first_name' => 'Vendor',
            'last_name' => 'Owner',
            'email' => 'vendor@example.com',
        ]);

        $vendor = VendorProfile::factory()->create([
            'user_id' => $vendorUser->id,
            'business_name' => 'City Bike Rentals',
            'verification_status' => 'approved',
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'vendor_id' => $vendor->id,
            'name' => 'Mountain Bike',
        ]);

        $booking = Booking::factory()->create([
            'product_id' => $product->id,
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'status' => 'completed',
            'payment_status' => 'paid',
        ]);

        Dispute::create([
            'booking_id' => $booking->id,
            'complainant_id' => $customer->id,
            'respondent_id' => $vendorUser->id,
            'title' => 'Bike Damage Dispute',
            'description' => 'The bike was returned with damage',
            'reason' => 'damage',
            'status' => 'open',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/mediation-cases?per_page=20');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('cases.data.0.title', 'Bike Damage Dispute')
            ->assertJsonPath('cases.data.0.status', 'open')
            ->assertJsonPath('cases.data.0.reason', 'damage');
    }
}
