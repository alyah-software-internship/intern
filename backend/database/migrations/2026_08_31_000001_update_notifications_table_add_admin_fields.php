<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('priority', 20)->nullable()->default('medium')->after('link');
            $table->string('category', 50)->nullable()->default('system')->after('priority');
            $table->boolean('is_archived')->default(false)->after('is_read');
            $table->string('title_am', 255)->nullable()->after('title');
            $table->text('message_am')->nullable()->after('message');
            $table->timestamp('read_at')->nullable()->after('is_archived');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropColumn(['priority', 'category', 'is_archived', 'title_am', 'message_am', 'read_at']);
        });
    }
};
