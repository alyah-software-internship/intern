<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    protected $userService;
    protected $notificationService;

    public function __construct(
        UserService $userService,
        NotificationService $notificationService
    ) {
        $this->userService = $userService;
        $this->notificationService = $notificationService;
    }

    /**
     * Get user profile
     */
    public function profile(Request $request)
    {
        try {
            $user = $this->userService->getProfile($request->user()->id);
            
            return response()->json([
                'success' => true,
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|string|max:100',
            'middle_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'phone' => 'sometimes|string|max:50',
            'bio' => 'sometimes|string',
            'address' => 'sometimes|string|max:500',
            'city' => 'sometimes|string|max:100',
            'avatar' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $this->userService->updateProfile(
                $request->user()->id,
                $request->all()
            );

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => $user,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user notifications
     */
    public function notifications(Request $request)
    {
        try {
            $notifications = $this->userService->getNotifications(
                $request->user()->id,
                $request->limit ?? 20
            );

            $unreadCount = $this->userService->getUnreadNotificationsCount(
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(Request $request, $notificationId)
    {
        try {
            $notification = $this->userService->markNotificationAsRead(
                $request->user()->id,
                $notificationId
            );

            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsAsRead(Request $request)
    {
        try {
            $this->userService->markAllNotificationsAsRead(
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user stats
     */
    public function stats(Request $request)
    {
        try {
            $stats = $this->userService->getUserStats($request->user()->id);

            return response()->json([
                'success' => true,
                'stats' => $stats,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}