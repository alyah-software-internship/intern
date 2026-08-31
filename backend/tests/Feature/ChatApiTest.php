<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\ChatMessage;
use App\Models\Product;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ChatApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_and_vendor_can_send_and_fetch_messages_for_the_same_booking(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $vendorUser = User::factory()->create(['role' => 'vendor']);
        $vendor = VendorProfile::factory()->create(['user_id' => $vendorUser->id]);

        $product = Product::factory()->create([
            'vendor_id' => $vendor->id,
            'status' => 'active',
            'availability_status' => 'available',
        ]);

        $booking = Booking::factory()->create([
            'product_id' => $product->id,
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'status' => 'confirmed',
        ]);

        Sanctum::actingAs($customer);

        $response = $this->postJson("/api/bookings/{$booking->id}/messages", [
            'message' => 'Hello vendor, is the item available?',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('chat_messages', [
            'booking_id' => $booking->id,
            'sender_id' => $customer->id,
            'message' => 'Hello vendor, is the item available?',
        ]);

        Sanctum::actingAs($vendorUser);

        $fetchResponse = $this->getJson("/api/bookings/{$booking->id}/messages");
        $fetchResponse->assertStatus(200)
            ->assertJsonPath('booking_id', $booking->id)
            ->assertJsonFragment(['text' => 'Hello vendor, is the item available?']);
    }

    public function test_vendor_can_send_message_to_customer_for_the_same_booking(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);
        $vendorUser = User::factory()->create(['role' => 'vendor']);
        $vendor = VendorProfile::factory()->create(['user_id' => $vendorUser->id]);

        $product = Product::factory()->create([
            'vendor_id' => $vendor->id,
            'status' => 'active',
            'availability_status' => 'available',
        ]);

        $booking = Booking::factory()->create([
            'product_id' => $product->id,
            'customer_id' => $customer->id,
            'vendor_id' => $vendor->id,
            'status' => 'confirmed',
        ]);

        Sanctum::actingAs($vendorUser);

        $response = $this->postJson("/api/bookings/{$booking->id}/messages", [
            'message' => 'Your booking is confirmed. Please share your delivery details.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.booking_id', $booking->id)
            ->assertJsonFragment(['text' => 'Your booking is confirmed. Please share your delivery details.']);

        $this->assertDatabaseHas('chat_messages', [
            'booking_id' => $booking->id,
            'sender_id' => $vendorUser->id,
            'message' => 'Your booking is confirmed. Please share your delivery details.',
        ]);

        Sanctum::actingAs($customer);

        $fetchResponse = $this->getJson("/api/bookings/{$booking->id}/messages");
        $fetchResponse->assertStatus(200)
            ->assertJsonFragment(['text' => 'Your booking is confirmed. Please share your delivery details.']);
    }
}
