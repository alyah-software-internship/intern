<?php

use Illuminate\Foundation\Inspiring;
use App\Models\Category;
use App\Models\ProductImage;
use App\Services\MediaStorageService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('media:migrate-to-cloudinary', function (MediaStorageService $mediaStorage) {
    $resolveLocalPath = function (?string $url): ?string {
        if (!$url) {
            return null;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        $path = ltrim(str_replace('/storage/', '', $path), '/');
        $localPath = storage_path('app/public/' . $path);

        return is_file($localPath) ? $localPath : null;
    };

    $migrated = 0;
    $missing = 0;

    Category::whereNotNull('image_url')->each(function (Category $category) use (
        $resolveLocalPath,
        $mediaStorage,
        &$migrated,
        &$missing,
    ) {
        if (str_starts_with($category->image_url, 'https://res.cloudinary.com/')) {
            return;
        }

        $localPath = $resolveLocalPath($category->image_url);
        if (!$localPath) {
            $missing++;
            return;
        }

        $file = new UploadedFile($localPath, basename($localPath), mime_content_type($localPath), null, true);
        $category->update(['image_url' => $mediaStorage->uploadImage($file, 'categories')]);
        $migrated++;
    });

    ProductImage::all()->each(function (ProductImage $image) use (
        $resolveLocalPath,
        $mediaStorage,
        &$migrated,
        &$missing,
    ) {
        $storedUrl = $image->getRawOriginal('image_url');
        if (str_starts_with($storedUrl, 'https://res.cloudinary.com/')) {
            return;
        }

        $localPath = $resolveLocalPath($storedUrl);
        if (!$localPath) {
            $missing++;
            return;
        }

        $file = new UploadedFile($localPath, basename($localPath), mime_content_type($localPath), null, true);
        $image->update(['image_url' => $mediaStorage->uploadImage($file, 'products')]);
        $migrated++;
    });

    $this->info("Migrated {$migrated} images to Cloudinary.");
    if ($missing > 0) {
        $this->warn("{$missing} image files were not found locally and were skipped.");
    }
})->purpose('Migrate existing local category and product images to Cloudinary');
