<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_api_bookings_requires_authentication(): void
    {
        $response = $this->withHeaders([
            'Accept' => 'application/json',
        ])->get('/api/bookings');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }
}
