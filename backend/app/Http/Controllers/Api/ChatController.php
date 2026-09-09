<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\ChatMessage;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    public function __construct(protected NotificationService $notificationService)
    {
    }

    public function index(Request $request, $bookingId)
    {
        $user = $request->user();
        $booking = Booking::find($bookingId);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        $isCustomer = (int) $booking->customer_id === (int) $user->id;
        $isVendor = (int) $booking->vendor_id === (int) ($user->vendorProfile?->id ?? 0);

        if (!$isCustomer && !$isVendor && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to access this chat',
            ], 403);
        }

        $messages = ChatMessage::with(['sender', 'receiver'])
            ->where('booking_id', $bookingId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) {
                return [
                    'id' => $message->id,
                    'booking_id' => $message->booking_id,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'sender_role' => $message->sender_role,
                    'receiver_role' => $message->receiver_role,
                    'text' => $message->message,
                    'is_seen' => $message->is_seen,
                    'created_at' => $message->created_at->toISOString(),
                    'updated_at' => $message->updated_at->toISOString(),
                    'sender' => [
                        'id' => $message->sender?->id,
                        'name' => $message->sender?->full_name ?? $message->sender?->email,
                        'role' => $message->sender?->role,
                    ],
                    'receiver' => [
                        'id' => $message->receiver?->id,
                        'name' => $message->receiver?->full_name ?? $message->receiver?->email,
                        'role' => $message->receiver?->role,
                    ],
                ];
            });

        ChatMessage::where('booking_id', $bookingId)
            ->where('receiver_id', $user->id)
            ->where('is_seen', false)
            ->update(['is_seen' => true]);

        return response()->json([
            'success' => true,
            'booking_id' => (int) $bookingId,
            'messages' => $messages,
        ]);
    }

    public function store(Request $request, $bookingId)
    {
        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $booking = Booking::with(['customer', 'vendor.user'])->find($bookingId);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking not found',
            ], 404);
        }

        $isCustomer = (int) $booking->customer_id === (int) $user->id;
        $isVendor = (int) $booking->vendor_id === (int) ($user->vendorProfile?->id ?? 0);

        if (!$isCustomer && !$isVendor && !$user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'You are not allowed to send messages for this booking',
            ], 403);
        }

        $receiver = $isCustomer ? $booking->vendor->user : $booking->customer;

        $message = ChatMessage::create([
            'booking_id' => $bookingId,
            'sender_id' => $user->id,
            'receiver_id' => $receiver?->id,
            'sender_role' => $user->role,
            'receiver_role' => $receiver?->role ?? 'vendor',
            'message' => trim($request->input('message')),
            'is_seen' => false,
        ]);

        if ($receiver) {
            $this->notificationService->messageReceived(
                $receiver->id,
                [
                    'sender' => $user->full_name ?? $user->email,
                    'reference' => $booking->booking_reference,
                    'link' => $receiver->role === 'customer'
                        ? "/booking-details/{$booking->id}"
                        : '/vendor/messages',
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => [
                'id' => $message->id,
                'booking_id' => (int) $message->booking_id,
                'sender_id' => (int) $message->sender_id,
                'receiver_id' => (int) $message->receiver_id,
                'sender_role' => $message->sender_role,
                'receiver_role' => $message->receiver_role,
                'text' => $message->message,
                'created_at' => $message->created_at->toISOString(),
            ],
        ], 201);
    }
}
