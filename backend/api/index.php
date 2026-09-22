<?php

// Vercel's deployment filesystem is read-only except for /tmp.
$_ENV['CACHE_STORE'] ??= 'array';
$_ENV['SESSION_DRIVER'] ??= 'array';
$_ENV['QUEUE_CONNECTION'] ??= 'sync';
$_ENV['LOG_CHANNEL'] ??= 'stderr';

require __DIR__ . '/../public/index.php';
