<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationRolesApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_allows_customer_vendor_and_operator_roles(): void
    {
        $customerResponse = $this->postJson('/api/register', [
            'email' => 'customer@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'first_name' => 'Customer',
            'middle_name' => 'Test',
            'last_name' => 'User',
            'phone' => '0911111111',
            'role' => 'customer',
        ]);

        $customerResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('user.role', 'customer');

        $vendorResponse = $this->postJson('/api/register', [
            'email' => 'vendor@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'first_name' => 'Vendor',
            'middle_name' => 'Test',
            'last_name' => 'User',
            'phone' => '0922222222',
            'role' => 'vendor',
        ]);

        $vendorResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('user.role', 'vendor');

        $operatorResponse = $this->postJson('/api/register', [
            'email' => 'operator@example.com',
            'password' => 'secret123',
            'password_confirmation' => 'secret123',
            'first_name' => 'Operator',
            'middle_name' => 'Test',
            'last_name' => 'User',
            'phone' => '0933333333',
            'role' => 'operator',
        ]);

        $operatorResponse->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('user.role', 'operator');
    }
}
