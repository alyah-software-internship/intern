<?php

require __DIR__ . '/vendor/autoload.php';

$app = require __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Booking;
use App\Models\Product;
use App\Models\User;
use App\Models\VendorProfile;
use Illuminate\Http\Request;

$app['db']->beginTransaction();

$vendorUser = User::factory()->create(['role' => 'vendor', 'is_active' => true]);
$vendor = VendorProfile::factory()->create([
    'user_id' => $vendorUser->id,
    'verification_status' => 'approved',
    'is_active' => true,
    'rating' => 4.7,
    'response_time_avg' => 2.5,
]);

$product = Product::factory()->create([
    'vendor_id' => $vendor->id,
    'status' => 'active',
    'views_count' => 120,
]);

Booking::factory()->create([
    'product_id' => $product->id,
    'vendor_id' => $vendor->id,
    'customer_id' => User::factory()->create(['role' => 'customer', 'is_active' => true])->id,
    'status' => 'completed',
    'total_amount' => 250.00,
    'platform_fee' => 7.50,
    'vendor_payment' => 242.50,
]);

$request = new Request();
$request->setUserResolver(function () use ($vendorUser) {
    return $vendorUser;
});

$controller = app(App\Http\Controllers\Api\DashboardController::class);

try {
    $response = $controller->vendorAnalytics($request);
    echo $response->getStatusCode() . PHP_EOL;
    echo $response->getContent() . PHP_EOL;
} catch (Throwable $e) {
    echo get_class($e) . PHP_EOL;
    echo $e->getMessage() . PHP_EOL;
    echo $e->getTraceAsString() . PHP_EOL;
}

$app['db']->rollBack();
