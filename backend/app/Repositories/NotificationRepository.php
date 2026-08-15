<?php

namespace App\Repositories;

use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;

class NotificationRepository extends BaseRepository
{
    public function __construct(Notification $model)
    {
        parent::__construct($model);
    }

    /**
     * Get notifications by user
     */
    public function findByUser(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get unread notifications by user
     */
    public function getUnreadByUser(int $userId): Collection
    {
        return $this->model->where('user_id', $userId)
            ->where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get unread count by user
     */
    public function getUnreadCount(int $userId): int
    {
        return $this->model->where('user_id', $userId)
            ->where('is_read', false)
            ->count();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $notificationId): Notification
    {
        $notification = $this->findOrFail($notificationId);
        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
        return $notification;
    }

    /**
     * Mark all notifications as read for a user
     */
    public function markAllAsRead(int $userId): int
    {
        return $this->model->where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }
}