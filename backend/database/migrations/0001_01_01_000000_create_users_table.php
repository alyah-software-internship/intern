<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // Authentication
            $table->string('email')->unique();
            $table->string('password');

            // English names - required
            $table->string('first_name', 100);
            $table->string('middle_name', 100);
            $table->string('last_name', 100);

            // Amharic names - optional
            $table->string('first_name_am', 100)->nullable();
            $table->string('middle_name_am', 100)->nullable();
            $table->string('last_name_am', 100)->nullable();

            // Contact
            $table->string('phone', 50)->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('avatar_url', 500)->nullable();

            // Role & status
            $table->enum('role', [
                'admin',
                'vendor',
                'customer',
                'operator'
            ])->default('customer');

            $table->boolean('is_active')->default(true);
            $table->boolean('is_banned')->default(false);
            $table->text('banned_reason')->nullable();
            $table->timestamp('banned_at')->nullable();

            // Security
            $table->timestamp('last_login_at')->nullable();
            $table->string('last_login_ip', 45)->nullable();
            $table->integer('login_attempts')->default(0);
            $table->timestamp('locked_until')->nullable();
            $table->rememberToken();

            // Preferences
            $table->enum('preferred_language', ['en', 'am'])
                ->default('en');

            $table->string('preferred_currency', 3)
                ->default('ETB');

            $table->string('timezone', 50)
                ->default('Africa/Addis_Ababa');

            // Profile
            $table->text('bio')->nullable();
            $table->text('bio_am')->nullable();
            $table->date('date_of_birth')->nullable();

            $table->enum('gender', [
                'male',
                'female',
                'other',
                'prefer_not_to_say'
            ])->default('prefer_not_to_say');

            $table->string('address', 500)->nullable();
            $table->string('address_am', 500)->nullable();

            $table->string('city', 100)->nullable();
            $table->string('city_am', 100)->nullable();

            $table->string('country', 100)
                ->default('Ethiopia');

            $table->string('postal_code', 20)->nullable();

            // Meta
            $table->string('referral_code', 50)
                ->unique()
                ->nullable();

            $table->foreignId('referred_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->integer('trust_score')->default(0);

            $table->decimal('total_spent', 10, 2)
                ->default(0.00);

            $table->json('notification_preferences')
                ->nullable();

            // Timestamps
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('phone');
            $table->index('role');
            $table->index('first_name');
            $table->index('middle_name');
            $table->index('last_name');
            $table->index('first_name_am');
            $table->index('middle_name_am');
            $table->index('last_name_am');
            $table->index('is_active');
            $table->index('preferred_language');
            $table->index('city');

            // Full-text search
            $table->fullText(
                ['first_name', 'middle_name', 'last_name', 'bio'],
                'idx_search_english'
            );

            $table->fullText(
                ['first_name_am', 'middle_name_am', 'last_name_am', 'bio_am'],
                'idx_search_amharic'
            );
        });

        // Laravel infrastructure tables
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};