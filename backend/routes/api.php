<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// =============================================
// CONTROLLER IMPORTS
// =============================================
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\OperatorController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\WalletController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'status' => 'success'
    ]);
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'app' => 'i-Share API',
        'version' => '1.0.0'
    ]);
});

// =============================================
// PUBLIC ROUTES (No authentication required)
// =============================================

// Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Product Routes (Public)
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
Route::get('/products/featured', [ProductController::class, 'featured']);
Route::get('/products/search', [ProductController::class, 'search']);

// Category Routes (Public)
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/products', [CategoryController::class, 'products']);

// Review Routes (Public - View only)
Route::get('/reviews/product/{productId}', [ReviewController::class, 'productReviews']);
Route::get('/reviews/vendor/{vendorId}', [ReviewController::class, 'vendorReviews']);

// =============================================
// AUTHENTICATED ROUTES (User must be logged in)
// =============================================

Route::middleware('auth:sanctum')->group(function () {
    
    // ========== AUTH ROUTES ==========
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // ========== USER ROUTES ==========
    Route::prefix('user')->group(function () {
        Route::get('/profile', [UserController::class, 'profile']);
        Route::post('/profile', [UserController::class, 'updateProfile']);
        Route::put('/profile', [UserController::class, 'updateProfile']);
        Route::get('/stats', [UserController::class, 'stats']);
        Route::get('/notifications', [UserController::class, 'notifications']);
        Route::post('/notifications/{id}/read', [UserController::class, 'markNotificationAsRead']);
        Route::post('/notifications/read-all', [UserController::class, 'markAllNotificationsAsRead']);
        Route::get('/bookings', [BookingController::class, 'index']);
    });
    
    // ============================================================
    // ⚠️ VENDOR REGISTRATION - OUTSIDE VENDOR MIDDLEWARE! ⚠️
    // This allows any authenticated user to register as a vendor
    // ============================================================
    Route::post('/vendor/register', [VendorController::class, 'register']);
    Route::get('/vendor/profile', [VendorController::class, 'profile']);
    Route::put('/vendor/profile', [VendorController::class, 'updateProfile']);
    Route::post('/vendor/verification', [VendorController::class, 'submitVerification']);
    Route::post('/vendor/payment-methods', [VendorController::class, 'addPaymentMethod']);
    Route::put('/vendor/payment-methods/{id}', [VendorController::class, 'updatePaymentMethod']);
    Route::delete('/vendor/payment-methods/{id}', [VendorController::class, 'deletePaymentMethod']);

    Route::prefix('operator')->group(function () {
        Route::get('/assignments', [OperatorController::class, 'assignments']);
    });
    
    // ============================================================
    // VENDOR ROUTES (Requires vendor role) 
    // These routes can only be accessed after becoming a vendor
    // ============================================================
    Route::middleware('vendor')->prefix('vendor')->group(function () {
        
        // These routes are protected by vendor middleware
        Route::get('/dashboard', [VendorController::class, 'dashboard']);
        Route::get('/products', [VendorController::class, 'products']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::get('/bookings', [BookingController::class, 'vendorBookings']);
        Route::put('/bookings/{id}/approve', [BookingController::class, 'approve']);
        Route::put('/bookings/{id}/reject', [BookingController::class, 'reject']);
        Route::put('/bookings/{id}/complete', [BookingController::class, 'complete']);
        Route::get('/revenue', [VendorController::class, 'revenue']);
        Route::get('/analytics', [DashboardController::class, 'vendorAnalytics']);
        Route::get('/payments/summary', [PaymentController::class, 'vendorSummary']);
        Route::get('/wallet', [WalletController::class, 'show']);
        Route::get('/wallet/transactions', [WalletController::class, 'transactions']);
        Route::get('/payouts', [WalletController::class, 'payouts']);
        Route::post('/payouts', [WalletController::class, 'requestPayout']);
        
        // Operators
        Route::prefix('operators')->group(function () {
            Route::get('/candidates', [OperatorController::class, 'candidates']);
            Route::post('/candidates/{userId}/hire', [OperatorController::class, 'hireCandidate']);
            Route::get('/', [OperatorController::class, 'index']);
            Route::get('/available', [OperatorController::class, 'available']);
            Route::post('/', [OperatorController::class, 'store']);
            Route::get('/{id}', [OperatorController::class, 'show']);
            Route::put('/{id}', [OperatorController::class, 'update']);
            Route::delete('/{id}', [OperatorController::class, 'destroy']);
            Route::post('/{id}/assign', [OperatorController::class, 'assignToProduct']);
            Route::delete('/{id}/remove/{productId}', [OperatorController::class, 'removeFromProduct']);
            Route::get('/{id}/availability', [OperatorController::class, 'availability']);
            Route::post('/{id}/availability', [OperatorController::class, 'updateAvailability']);
            Route::post('/{id}/status', [OperatorController::class, 'updateStatus']);
            Route::get('/{id}/stats', [OperatorController::class, 'stats']);
        });
    });
    
    // ========== BOOKING ROUTES ==========
    Route::middleware('auth:sanctum')->prefix('bookings')->group(function () {
        Route::post('/', [BookingController::class, 'store']);
        Route::get('/', [BookingController::class, 'index']);
        Route::get('/{id}', [BookingController::class, 'show']);
        Route::put('/{id}/cancel', [BookingController::class, 'cancel']);
        Route::post('/{id}/pay', [PaymentController::class, 'processPayment']);
    });
    
    // ========== PAYMENT ROUTES ==========
    Route::prefix('payments')->group(function () {
        Route::get('/', [PaymentController::class, 'index']);
        Route::get('/{id}', [PaymentController::class, 'show']);
    });
    
    // ========== NOTIFICATION ROUTES ==========
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{id}', [NotificationController::class, 'destroy']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    });

    // ========== CHAT ROUTES ==========
    Route::prefix('bookings/{bookingId}/messages')->group(function () {
        Route::get('/', [ChatController::class, 'index']);
        Route::post('/', [ChatController::class, 'store']);
    });
    
    // ========== REVIEW ROUTES ==========
    Route::prefix('reviews')->group(function () {
        Route::get('/my', [ReviewController::class, 'myReviews']);
        Route::post('/', [ReviewController::class, 'store']);
        Route::get('/{id}', [ReviewController::class, 'show']);
        Route::put('/{id}', [ReviewController::class, 'update']);
        Route::delete('/{id}', [ReviewController::class, 'destroy']);
        Route::post('/{id}/report', [ReviewController::class, 'report']);
    });
    
    // ========== WISHLIST ROUTES ==========
    Route::prefix('wishlist')->group(function () {
        Route::get('/', [WishlistController::class, 'index']);
        Route::post('/{productId}', [WishlistController::class, 'add']);
        Route::delete('/{productId}', [WishlistController::class, 'remove']);
        Route::post('/toggle/{productId}', [WishlistController::class, 'toggle']);
        Route::get('/check/{productId}', [WishlistController::class, 'check']);
        Route::delete('/clear', [WishlistController::class, 'clear']);
    });
});

// =============================================
// ADMIN ROUTES (Admin Only)
// =============================================

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    Route::get('/dashboard', [DashboardController::class, 'adminDashboard']);
    Route::get('/analytics', [DashboardController::class, 'adminAnalytics']);

    // ========== CATEGORY MANAGEMENT ==========
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::get('/categories/all', [CategoryController::class, 'all']);
    Route::post('/categories/{id}/toggle', [CategoryController::class, 'toggleActive']);
    Route::post('/categories/reorder', [CategoryController::class, 'reorder']);
    
    // User Management
    Route::get('/users', [AdminController::class, 'users']);
    Route::get('/users/{id}', [AdminController::class, 'userDetails']);
    Route::post('/users/{id}/ban', [AdminController::class, 'banUser']);
    Route::post('/users/{id}/unban', [AdminController::class, 'unbanUser']);
    Route::post('/users/{id}/activate', [AdminController::class, 'activateUser']);
    Route::post('/users/{id}/deactivate', [AdminController::class, 'deactivateUser']);
    Route::post('/users/{userId}/documents/{documentId}/approve', [AdminController::class, 'approveDocument']);
    Route::post('/users/{userId}/documents/{documentId}/reject', [AdminController::class, 'rejectDocument']);
    
    // Vendor Management
    Route::get('/vendors/pending', [AdminController::class, 'pendingVendors']);
    Route::get('/vendors', [AdminController::class, 'vendors']);
    Route::get('/escrow-ledger', [AdminController::class, 'escrowLedger']);
    Route::get('/mediation-cases', [AdminController::class, 'mediationCases']);
    Route::post('/mediation-cases/{id}/resolve', [AdminController::class, 'resolveMediation']);
    Route::get('/vendors/{id}', [AdminController::class, 'vendorDetails']);
    Route::post('/vendors/{id}/approve', [AdminController::class, 'approveVendor']);
    Route::post('/vendors/{id}/reject', [AdminController::class, 'rejectVendor']);
    Route::post('/vendors/{id}/activate', [AdminController::class, 'activateVendor']);
    Route::post('/vendors/{id}/deactivate', [AdminController::class, 'deactivateVendor']);
    Route::post('/vendors/{id}/block', [AdminController::class, 'blockVendor']);
    Route::post('/vendors/{id}/suspend', [AdminController::class, 'suspendVendor']);
    
    // Reviews
    Route::get('/reviews', [ReviewController::class, 'adminReviews']);
    Route::post('/reviews/{id}/approve', [ReviewController::class, 'approve']);
    Route::post('/reviews/{id}/reject', [ReviewController::class, 'reject']);
    
    // Operators
    Route::get('/operators/performance', [OperatorController::class, 'performance']);
    Route::post('/operators/{id}/verify', [OperatorController::class, 'verify']);
    
    // Reports
    Route::get('/reports', [AdminController::class, 'reports']);
    Route::get('/system-health', [AdminController::class, 'systemHealth']);
    Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
    Route::get('/platform-settings', [AdminController::class, 'platformSettings']);
    Route::put('/platform-settings', [AdminController::class, 'platformSettings']);
    Route::post('/platform-settings', [AdminController::class, 'platformSettings']);
});

// =============================================
// FALLBACK ROUTE
// =============================================

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'API endpoint not found'
    ], 404);
});