<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminUsersApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_users_endpoint_returns_normalized_user_and_flag_data(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'is_active' => true,
            'is_banned' => false,
        ]);

        $customer = User::factory()->create([
            'role' => 'customer',
            'first_name' => 'Jane',
            'middle_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'jane@example.com',
            'is_active' => false,
            'is_banned' => true,
            'banned_reason' => 'Suspicious activity',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->getJson('/api/admin/users?per_page=20');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonFragment(['email' => 'jane@example.com'])
            ->assertJsonPath('users.data.1.full_name', 'Jane John Doe')
            ->assertJsonPath('users.data.1.flags.active', false)
            ->assertJsonPath('users.data.1.flags.banned', true)
            ->assertJsonPath('users.data.1.flags.label', 'Banned');
    }
}
