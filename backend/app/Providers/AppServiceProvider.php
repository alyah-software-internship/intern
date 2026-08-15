<?php

namespace App\Providers;

use App\Services\AuthService;
use App\Services\UserService;
use App\Services\VendorService;
use App\Services\ProductService;
use App\Services\BookingService;
use App\Services\PaymentService;
use App\Services\NotificationService;
use App\Services\DashboardService;
use App\Services\ReportService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Register all services as singletons
        $this->app->singleton(AuthService::class, function ($app) {
            return new AuthService();
        });

        $this->app->singleton(UserService::class, function ($app) {
            return new UserService();
        });

        $this->app->singleton(VendorService::class, function ($app) {
            return new VendorService();
        });

        $this->app->singleton(ProductService::class, function ($app) {
            return new ProductService();
        });

        $this->app->singleton(BookingService::class, function ($app) {
            return new BookingService();
        });

        $this->app->singleton(PaymentService::class, function ($app) {
            return new PaymentService(
                $app->make(NotificationService::class)
            );
        });

        $this->app->singleton(NotificationService::class, function ($app) {
            return new NotificationService();
        });

        $this->app->singleton(DashboardService::class, function ($app) {
            return new DashboardService();
        });

        $this->app->singleton(ReportService::class, function ($app) {
            return new ReportService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}