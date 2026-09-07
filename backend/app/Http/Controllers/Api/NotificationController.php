<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ChatMessage;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request)
    {
        try {
            $notifications = $this->notificationService->getUserNotifications(
                $request->user()->id,
                $request->limit ?? 50
            );

            $unreadCount = $this->notificationService->getUnreadCount(
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
     * Mark a notification as read
     */
    public function markAsRead($id, Request $request)
    {
        try {
            $notification = $this->notificationService->markAsRead(
                $request->user()->id,
                $id
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
    public function markAllAsRead(Request $request)
    {
        try {
            $count = $this->notificationService->markAllAsRead(
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => "{$count} notifications marked as read",
                'count' => $count,
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
     * Archive a notification
     */
    public function archive($id, Request $request)
    {
        try {
            $notification = $this->notificationService->archive(
                $request->user()->id,
                $id
            );

            if (!$notification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Notification archived',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to archive notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a notification
     */
    public function destroy($id, Request $request)
    {
        try {
            $deleted = $this->notificationService->delete(
                $request->user()->id,
                $id
            );

            if (!$deleted) {
                return response()->json([
                    'success' => false,
                    'message' => 'Notification not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Notification deleted',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notification count
     */
    public function unreadCount(Request $request)
    {
        try {
            $notificationCount = $this->notificationService->getUnreadCount(
                $request->user()->id
            );
            $messageCount = ChatMessage::where('receiver_id', $request->user()->id)
                ->where('is_seen', false)
                ->count();

            return response()->json([
                'success' => true,
                'unread_count' => $notificationCount + $messageCount,
                'unread_notifications' => $notificationCount,
                'unread_messages' => $messageCount,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}