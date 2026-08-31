<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Product;
use App\Models\SecurityDeposit;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminEscrowLedgerApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_escrow_ledger_endpoint_returns_security_deposit_records(): void
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
            'security_deposit_amount' => 150.00,
            'security_deposit_status' => 'held',
            'status' => 'confirmed',
            'payment_status' => 'paid',
        ]);

        SecurityDeposit::create([
            'booking_id' => $booking->id,
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'amount' => 150.00,
            'status' => 'held',
            'held_at' => now(),
            'notes' => 'Escrow held for bike rental',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/escrow-ledger?per_page=20');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('ledger.data.0.customer.email', 'jane@example.com')
            ->assertJsonPath('ledger.data.0.vendor.business_name', 'City Bike Rentals')
            ->assertJsonPath('ledger.data.0.status', 'held');
    }
}
