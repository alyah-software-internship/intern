<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'title_am',
        'message',
        'message_am',
        'link',
        'priority',
        'category',
        'is_read',
        'is_archived',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'is_archived' => 'boolean',
        'created_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    // ========== RELATIONSHIPS ==========
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // ========== SCOPES ==========
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    // ========== HELPERS ==========
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }
}