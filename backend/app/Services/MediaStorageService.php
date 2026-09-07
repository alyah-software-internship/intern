<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class MediaStorageService
{
    public function uploadImage(UploadedFile $file, string $directory): string
    {
        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk(config('filesystems.media_disk', 'public'));
        $path = $disk->putFile($directory, $file);

        if (!$path) {
            throw new \RuntimeException('Unable to upload image.');
        }

        return $disk->url($path);
    }
}