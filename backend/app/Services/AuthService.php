<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Register a new user
     */
    public function register(array $data)
    {
        $user = User::create([
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'first_name' => $data['first_name'],
            'middle_name' => $data['middle_name'],
            'last_name' => $data['last_name'],
            'first_name_am' => $data['first_name_am'] ?? null,
            'middle_name_am' => $data['middle_name_am'] ?? null,
            'last_name_am' => $data['last_name_am'] ?? null,
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'] ?? 'customer',
            'is_active' => true,
            'referral_code' => $this->generateReferralCode($data['first_name'], $data['last_name']),
        ]);

        // Send verification email
        $this->sendVerificationEmail($user);

        return $user;
    }

    /**
     * Login user
     */
    public function login(array $credentials)
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return null;
        }

        // Update last login
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);

        return $user;
    }

    /**
     * Logout user
     */
    public function logout($user)
    {
        $user->currentAccessToken()->delete();
        return true;
    }

    /**
     * Send verification email
     */
    public function sendVerificationEmail(User $user)
    {
        $token = Str::random(64);
        
        // Store token in password_reset_tokens table or create a new table
        // Mail::to($user->email)->send(new VerifyEmailMail($token));
        
        return $token;
    }

    /**
     * Verify email
     */
    public function verifyEmail($token)
    {
        // Find user by token and verify
        // $user = User::where('verification_token', $token)->first();
        // if ($user) {
        //     $user->update([
        //         'email_verified_at' => now(),
        //         'verification_token' => null,
        //     ]);
        //     return $user;
        // }
        // return null;
    }

    /**
     * Generate referral code
     */
    private function generateReferralCode($firstName, $lastName)
    {
        $code = strtoupper(substr($firstName, 0, 3) . substr($lastName, 0, 3) . rand(100, 999));
        
        // Ensure uniqueness
        while (User::where('referral_code', $code)->exists()) {
            $code = strtoupper(substr($firstName, 0, 3) . substr($lastName, 0, 3) . rand(100, 999));
        }
        
        return $code;
    }

    /**
     * Reset password
     */
    public function resetPassword($email, $newPassword)
    {
        $user = User::where('email', $email)->first();
        if (!$user) {
            return null;
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        return $user;
    }
}