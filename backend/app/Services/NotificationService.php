<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    /**
     * Create a new notification
     */
    public function createNotification(
        int $userId,
        string $type,
        string $title,
        string $message,
        ?string $link = null,
        string $priority = 'medium',
        string $category = 'system'
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'link' => $link,
            'priority' => $priority,
            'category' => $category,
            'is_read' => false,
        ]);
    }

    /**
     * Create notification with Amharic translation
     */
    public function createBilingualNotification(
        int $userId,
        string $type,
        string $title,
        string $titleAm,
        string $message,
        string $messageAm,
        ?string $link = null,
        string $priority = 'medium',
        string $category = 'system'
    ): Notification {
        return Notification::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'title_am' => $titleAm,
            'message' => $message,
            'message_am' => $messageAm,
            'link' => $link,
            'priority' => $priority,
            'category' => $category,
            'is_read' => false,
        ]);
    }

    /**
     * Get user notifications
     */
    public function getUserNotifications(int $userId, int $limit = 20)
    {
        return Notification::where('user_id', $userId)
            ->where('is_archived', false)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get unread notifications count
     */
    public function getUnreadCount(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->where('is_archived', false)
            ->count();
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(int $userId, int $notificationId): ?Notification
    {
        $notification = Notification::where('user_id', $userId)
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
            return $notification;
        }

        return null;
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(int $userId): int
    {
        return Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
    }

    /**
     * Archive notification
     */
    public function archive(int $userId, int $notificationId): ?Notification
    {
        $notification = Notification::where('user_id', $userId)
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->update(['is_archived' => true]);
            return $notification;
        }

        return null;
    }

    /**
     * Delete notification
     */
    public function delete(int $userId, int $notificationId): bool
    {
        return Notification::where('user_id', $userId)
            ->where('id', $notificationId)
            ->delete();
    }

    /**
     * Send email notification
     */
    public function sendEmail(string $email, string $subject, string $view, array $data): bool
    {
        try {
            Mail::send($view, $data, function ($message) use ($email, $subject) {
                $message->to($email)
                    ->subject($subject)
                    ->from(config('mail.from.address'), config('mail.from.name'));
            });
            return true;
        } catch (\Exception $e) {
            Log::error('Email sending failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Send SMS notification (placeholder)
     */
    public function sendSms(string $phoneNumber, string $message): bool
    {
        // Implement SMS gateway integration here
        // Example: Twilio, Africa's Talking, etc.
        Log::info("SMS sent to {$phoneNumber}: {$message}");
        return true;
    }

    /**
     * Send push notification (placeholder)
     */
    public function sendPush(int $userId, string $title, string $body, array $data = []): bool
    {
        // Implement push notification service here
        // Example: Firebase Cloud Messaging, OneSignal, etc.
        Log::info("Push notification sent to user {$userId}: {$title}");
        return true;
    }

    // ========== SPECIFIC NOTIFICATION TYPES ==========

    /**
     * Booking created notification
     */
    public function bookingCreated(int $userId, array $bookingData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'booking_created',
            'New Booking Created',
            'አዲስ ቦታ ማስያዝ ተፈጥሯል',
            "Your booking #{$bookingData['reference']} has been created successfully.",
            "ቦታ ማስያዝዎ #{$bookingData['reference']} በተሳካ ሁኔታ ተፈጥሯል።",
            $bookingData['link'] ?? null,
            'high',
            'booking'
        );
    }

    /**
     * Booking confirmed notification
     */
    public function bookingConfirmed(int $userId, array $bookingData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'booking_confirmed',
            'Booking Confirmed',
            'ቦታ ማስያዝ ተረጋግጧል',
            "Your booking #{$bookingData['reference']} has been confirmed.",
            "ቦታ ማስያዝዎ #{$bookingData['reference']} ተረጋግጧል።",
            $bookingData['link'] ?? null,
            'high',
            'booking'
        );
    }

    /**
     * Booking cancelled notification
     */
    public function bookingCancelled(int $userId, array $bookingData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'booking_cancelled',
            'Booking Cancelled',
            'ቦታ ማስያዝ ተሰርዟል',
            "Your booking #{$bookingData['reference']} has been cancelled.",
            "ቦታ ማስያዝዎ #{$bookingData['reference']} ተሰርዟል።",
            $bookingData['link'] ?? null,
            'high',
            'booking'
        );
    }

    /**
     * Payment received notification
     */
    public function paymentReceived(int $userId, array $paymentData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'payment_received',
            'Payment Received',
            'ክፍያ ተቀብለናል',
            "Payment of {$paymentData['amount']} has been received for booking #{$paymentData['reference']}.",
            "ለቦታ ማስያዝ #{$paymentData['reference']} የ{$paymentData['amount']} ክፍያ ተቀብለናል።",
            $paymentData['link'] ?? null,
            'high',
            'payment'
        );
    }

    /**
     * Incoming chat message notification
     */
    public function messageReceived(int $userId, array $messageData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'message_received',
            'New Message',
            'አዲስ መልዕክት',
            "You received a new message from {$messageData['sender']} for booking #{$messageData['reference']}.",
            "ለቦታ ማስያዝ #{$messageData['reference']} ከ{$messageData['sender']} አዲስ መልዕክት ደርሶዎታል።",
            $messageData['link'] ?? null,
            'medium',
            'message'
        );
    }

    /**
     * Vendor approved notification
     */
    public function vendorApproved(int $userId, array $vendorData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'vendor_approved',
            'Vendor Application Approved!',
            'የአቅራቢ ማመልከቻ ጸድቋል!',
            "Congratulations! Your vendor application has been approved. You can now start listing products.",
            "እንኳን ደስ አለዎት! የአቅራቢ ማመልከቻዎ ጸድቋል። አሁን ምርቶችን መዘርዘር ይችላሉ።",
            $vendorData['link'] ?? '/vendor/dashboard',
            'high',
            'vendor'
        );
    }

    /**
     * Vendor rejected notification
     */
    public function vendorRejected(int $userId, string $reason): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'vendor_rejected',
            'Vendor Application Rejected',
            'የአቅራቢ ማመልከቻ ውድቅ ተደርጓል',
            "Your vendor application has been rejected. Reason: {$reason}",
            "የአቅራቢ ማመልከቻዎ ውድቅ ተደርጓል። ምክንያት: {$reason}",
            '/vendor/register',
            'high',
            'vendor'
        );
    }

    /**
     * Security deposit released notification
     */
    public function depositReleased(int $userId, array $depositData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'deposit_released',
            'Security Deposit Released',
            'የዋስትና ገንዘብ ተለቋል',
            "Your security deposit of {$depositData['amount']} has been released for booking #{$depositData['reference']}.",
            "ለቦታ ማስያዝ #{$depositData['reference']} የ{$depositData['amount']} የዋስትና ገንዘብ ተለቋል።",
            $depositData['link'] ?? null,
            'medium',
            'payment'
        );
    }

    /**
     * Security deposit deducted notification
     */
    public function depositDeducted(int $userId, array $depositData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'deposit_deducted',
            'Security Deposit Deducted',
            'የዋስትና ገንዘብ ተቀንሷል',
            "An amount of {$depositData['deducted_amount']} has been deducted from your security deposit for booking #{$depositData['reference']}.",
            "ለቦታ ማስያዝ #{$depositData['reference']} የ{$depositData['deducted_amount']} የዋስትና ገንዘብ ተቀንሷል።",
            $depositData['link'] ?? null,
            'medium',
            'payment'
        );
    }

    /**
     * Subscription expired notification
     */
    public function subscriptionExpired(int $userId, array $subscriptionData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'subscription_expired',
            'Subscription Expired',
            'የደንበኝነት ምዝገባ አልቋል',
            "Your subscription has expired. Please renew to continue using our services.",
            "የደንበኝነት ምዝገባዎ አልቋል። አገልግሎታችንን መጠቀም ለመቀጠል እባክዎ ያድሱት።",
            $subscriptionData['link'] ?? '/subscription',
            'high',
            'system'
        );
    }

    /**
     * Review reminder notification
     */
    public function reviewReminder(int $userId, array $bookingData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'review_reminder',
            'Review Reminder',
            'ግምገማ ማስታወሻ',
            "Please leave a review for your recent booking #{$bookingData['reference']}.",
            "እባክዎ ለቅርብ ቦታ ማስያዝዎ #{$bookingData['reference']} ግምገማ ይስጡ።",
            $bookingData['link'] ?? null,
            'low',
            'customer'
        );
    }

    /**
     * Security alert notification
     */
    public function securityAlert(int $userId, array $alertData): Notification
    {
        return $this->createBilingualNotification(
            $userId,
            'security_alert',
            'Security Alert',
            'የደህንነት ማስጠንቀቂያ',
            "We detected an unusual login attempt to your account from a new device.",
            "ከአዲስ መሳሪያ ወደ መለያዎ ያልተለመደ የመግባት ሙከራ ተለይቷል።",
            '/security',
            'urgent',
            'security'
        );
    }

    /**
     * Bulk notifications
     */
    public function sendBulkNotifications(array $userIds, array $data): int
    {
        $notifications = [];
        foreach ($userIds as $userId) {
            $notifications[] = [
                'user_id' => $userId,
                'type' => $data['type'] ?? 'system',
                'title' => $data['title'],
                'title_am' => $data['title_am'] ?? null,
                'message' => $data['message'],
                'message_am' => $data['message_am'] ?? null,
                'link' => $data['link'] ?? null,
                'priority' => $data['priority'] ?? 'medium',
                'category' => $data['category'] ?? 'system',
                'is_read' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        return Notification::insert($notifications) ? count($notifications) : 0;
    }
}