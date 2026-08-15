<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuthService;
use App\Services\UserService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

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
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'first_name' => 'required|string|max:100',
            'middle_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|in:customer,vendor',
        ]);

        if ($validator->fails()) {
            return response()->json([
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
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
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
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $this->authService->login($request->only('email', 'password'));

            if (!$user) {
                return response()->json([
                    'message' => 'Invalid credentials'
                ], 401);
            }

            if (!$user->is_active) {
                return response()->json([
                    'message' => 'Your account is deactivated'
                ], 403);
            }

            if ($user->is_banned) {
                return response()->json([
                    'message' => 'Your account has been banned. Reason: ' . $user->banned_reason
                ], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'role' => $user->role,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Logged out successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
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
                'user' => $user,
                'unread_notifications' => $this->notificationService->getUnreadCount($user->id),
            ]);

        } catch (\Exception $e) {
            return response()->json([
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
                'message' => 'Token refreshed',
                'token' => $token,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to refresh token',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}