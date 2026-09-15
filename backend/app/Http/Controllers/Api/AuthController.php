<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Services\UserService;
use App\Services\NotificationService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $authService;
    protected $userService;
    protected $notificationService;

    public function __construct(
        AuthService $authService,
        UserService $userService,
        NotificationService $notificationService
    ) {
        $this->authService = $authService;
        $this->userService = $userService;
        $this->notificationService = $notificationService;
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        $validator = Validator::make(['email' => $email], [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|in:customer,vendor,operator',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $this->authService->register($request->all());
            
            // Create welcome notification
            $this->notificationService->createNotification(
                $user->id,
                'welcome',
                'Welcome to i-Share!',
                'Thank you for registering with i-Share. Start exploring amazing rentals today!',
                '/dashboard',
                'high',
                'system'
            );

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Registration failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        Log::info('Login request received', ['email' => $request->email]);

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $this->authService->login($request->only('email', 'password'));

            if (!$user) {
                Log::warning('Login failed - invalid credentials', ['email' => $request->email]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is deactivated'
                ], 403);
            }

            if ($user->is_banned) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been banned. Reason: ' . $user->banned_reason
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Login successful', ['email' => $user->email]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'role' => $user->role,
                    'is_active' => $user->is_active,
                    'must_change_password' => (bool) $user->must_change_password,
                ],
                'token' => $token,
                'role' => $user->role,
            ]);

        } catch (\Exception $e) {
            Log::error('Login failed', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sign in with a Google access token issued by Google Identity Services.
     */
    public function googleLogin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'access_token' => 'required|string',
            'role' => 'nullable|in:customer,vendor,operator',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Google sign-in token is required.',
            ], 422);
        }

        try {
            $googleResponse = Http::withToken($request->access_token)
                ->timeout(10)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($googleResponse->failed() || !$googleResponse->json('email_verified')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to verify your Google account.',
                ], 401);
            }

            $googleUser = $googleResponse->json();
            $user = User::where('email', $googleUser['email'])->first();

            if (!$user) {
                $nameParts = preg_split('/\s+/', trim($googleUser['name'] ?? 'Google User'));
                $firstName = $nameParts[0] ?? 'Google';
                $lastName = count($nameParts) > 1 ? array_pop($nameParts) : 'User';
                $middleName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : $lastName;

                $user = User::create([
                    'email' => $googleUser['email'],
                    'password' => Str::random(40),
                    'first_name' => $firstName,
                    'middle_name' => $middleName,
                    'last_name' => $lastName,
                    'avatar_url' => $googleUser['picture'] ?? null,
                    'email_verified_at' => now(),
                    'role' => $request->input('role', 'customer'),
                    'is_active' => true,
                ]);
            }

            if (!$user->is_active || $user->is_banned) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is not available.',
                ], 403);
            }

            $user->update(['last_login_at' => now(), 'last_login_ip' => $request->ip()]);
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'middle_name' => $user->middle_name,
                    'last_name' => $user->last_name,
                    'role' => $user->role,
                    'is_active' => $user->is_active,
                    'must_change_password' => (bool) $user->must_change_password,
                ],
                'token' => $token,
                'role' => $user->role,
            ]);
        } catch (\Throwable $exception) {
            Log::error('Google login failed', ['error' => $exception->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Google sign-in is temporarily unavailable.',
            ], 503);
        }
    }

    /**
     * Send a token-based password reset link.
     */
    public function forgotPassword(Request $request)
    {
        $email = strtolower(trim((string) $request->input('email')));

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please provide a valid email address.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $status = Password::sendResetLink(['email' => $email]);
        } catch (\Throwable $exception) {
            Log::error('Password reset link failed.', [
                'email' => $email,
                'error' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to send the password reset link. Please try again later.',
            ], 503);
        }

        if ($status === Password::RESET_THROTTLED) {
            return response()->json([
                'success' => false,
                'message' => 'Please wait before requesting another reset link.',
            ], 429);
        }

        if ($status === Password::INVALID_USER) {
            return response()->json([
                'success' => true,
                'message' => 'If an account exists for that email, a password reset link has been sent.',
            ]);
        }

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => false,
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'If an account exists for that email, a password reset link has been sent.',
        ]);
    }

    /**
     * Replace the currently authenticated password.
     */
    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please check your password details.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'The current password is incorrect.',
            ], 422);
        }

        $user->forceFill([
            'password' => $request->password,
            'must_change_password' => false,
        ])->save();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }

    /**
     * Complete a password reset using the emailed token.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Please check the reset details and try again.',
                'errors' => $validator->errors(),
            ], 422);
        }

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => $password,
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'success' => false,
                'message' => __($status),
            ], 422);
        }

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully. You can now sign in.',
        ]);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get authenticated user
     */
    public function user(Request $request)
    {
        try {
            $user = $this->userService->getProfile($request->user()->id);
            
            return response()->json([
                'success' => true,
                'user' => $user,
                'unread_notifications' => $this->notificationService->getUnreadCount($user->id),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get user profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh token
     */
    public function refresh(Request $request)
    {
        try {
            $user = $request->user();
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Token refreshed',
                'token' => $token,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to refresh token',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}