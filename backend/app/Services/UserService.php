<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\Storage;

class UserService
{
    /**
     * Get user profile with relationships
     */
    public function getProfile($userId)
    {
        return User::with([
            'vendorProfile',
            'bookings' => function ($query) {
                $query->latest()->limit(10);
            },
            'notifications' => function ($query) {
                $query->unread();
            }
        ])->find($userId);
    }

    /**
     * Update user profile
     */
    public function updateProfile($userId, array $data)
    {
        $user = User::find($userId);
        
        if (isset($data['avatar'])) {
            $data['avatar_url'] = $this->uploadAvatar($data['avatar'], $user);
        }

        $user->update($data);
        return $user;
    }

    /**
     * Upload avatar
     */
    public function uploadAvatar($file, $user)
    {
        // Delete old avatar if exists
        if ($user->avatar_url) {
            Storage::delete('public/avatars/' . basename($user->avatar_url));
        }

        $path = $file->store('public/avatars');
        return Storage::url($path);
    }

    /**
     * Get user notifications
     */
    public function getNotifications($userId, $limit = 20)
    {
        return Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadNotificationsCount($userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead($userId, $notificationId)
    {
        $notification = Notification::where('user_id', $userId)
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->update(['is_read' => true]);
            return $notification;
        }

        return null;
    }

    /**
     * Mark all notifications as read
     */
    public function markAllNotificationsAsRead($userId)
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }

    /**
     * Get user stats
     */
    public function getUserStats($userId)
    {
        $user = User::find($userId);
        
        return [
            'total_bookings' => $user->bookings()->count(),
            'total_spent' => $user->total_spent,
            'trust_score' => $user->trust_score,
            'reviews_count' => $user->reviews()->count(),
        ];
    }
}