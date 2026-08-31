<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\PlatformCommissionSetting;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminRealDataApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_real_data_endpoints_return_database_values(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
        ]);

        Sanctum::actingAs($admin);

        $customer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'Customer',
            'last_name' => 'One',
        ]);

        $vendorUser = User::factory()->create([
            'role' => 'vendor',
            'first_name' => 'Vendor',
            'last_name' => 'One',
        ]);

        $vendorProfile = VendorProfile::factory()->create([
            'user_id' => $vendorUser->id,
            'business_name' => 'Acme Rentals',
            'verification_status' => 'approved',
            'is_active' => true,
        ]);

        Booking::factory()->create([
            'customer_id' => $customer->id,
            'vendor_id' => $vendorProfile->id,
            'status' => 'completed',
            'total_amount' => 250.00,
            'platform_fee' => 25.00,
        ]);

        $systemHealth = $this->getJson('/api/admin/system-health');
        $systemHealth->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('metrics.0.name', 'Database');

        $this->assertGreaterThanOrEqual(3, $systemHealth->json('summary.total_users'));
        $this->assertGreaterThanOrEqual(1, $systemHealth->json('summary.total_vendors'));

        $audit = $this->getJson('/api/admin/audit-logs');
        $audit->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('logs.0.action', 'user_created');

        PlatformCommissionSetting::query()->delete();
        PlatformCommissionSetting::create([
            'commission_type' => 'percentage',
            'commission_value' => 10,
            'min_commission' => 0,
            'max_commission' => 0,
            'applies_to' => 'all',
            'is_active' => true,
            'currency' => 'USD',
        ]);

        $settings = $this->getJson('/api/admin/platform-settings');
        $settings->assertOk()
            ->assertJsonPath('success', true);
        $this->assertEquals(10.0, (float) $settings->json('settings.commission_value'));
        $this->assertEquals('USD', $settings->json('settings.currency'));

        $updated = $this->putJson('/api/admin/platform-settings', [
            'commission_type' => 'percentage',
            'commission_value' => 12.5,
            'min_commission' => 0,
            'max_commission' => 50,
            'applies_to' => 'all',
            'is_active' => true,
            'currency' => 'ETB',
        ]);

        $updated->assertOk()
            ->assertJsonPath('success', true);
        $this->assertEquals(12.5, (float) $updated->json('settings.commission_value'));
        $this->assertEquals('ETB', $updated->json('settings.currency'));
    }

    public function test_admin_vendor_actions_can_approve_reject_activate_deactivate_and_block(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        Sanctum::actingAs($admin);

        $vendorUser = User::factory()->create(['role' => 'vendor']);
        $vendor = VendorProfile::factory()->create([
            'user_id' => $vendorUser->id,
            'verification_status' => 'pending',
            'is_active' => false,
        ]);

        $approve = $this->postJson('/api/admin/vendors/' . $vendor->id . '/approve', ['notes' => 'Approved after review']);
        $approve->assertOk()->assertJsonPath('success', true);
        $this->assertEquals('approved', $approve->json('vendor.verification_status'));
        $this->assertTrue((bool) $approve->json('vendor.is_active'));

        $deactivate = $this->postJson('/api/admin/vendors/' . $vendor->id . '/deactivate', ['reason' => 'Temporary admin hold']);
        $deactivate->assertOk()->assertJsonPath('success', true);
        $this->assertFalse((bool) $deactivate->json('vendor.is_active'));

        $activate = $this->postJson('/api/admin/vendors/' . $vendor->id . '/activate', []);
        $activate->assertOk()->assertJsonPath('success', true);
        $this->assertTrue((bool) $activate->json('vendor.is_active'));

        $reject = $this->postJson('/api/admin/vendors/' . $vendor->id . '/reject', ['reason' => 'Policy violation']);
        $reject->assertOk()->assertJsonPath('success', true);
        $this->assertEquals('rejected', $reject->json('vendor.verification_status'));

        $block = $this->postJson('/api/admin/vendors/' . $vendor->id . '/block', ['reason' => 'Blocked permanently']);
        $block->assertOk()->assertJsonPath('success', true);
        $this->assertEquals('suspended', $block->json('vendor.verification_status'));
        $this->assertFalse((bool) $block->json('vendor.is_active'));
    }
}
