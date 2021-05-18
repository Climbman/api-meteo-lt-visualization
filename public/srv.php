<?php declare(strict_types=1);

require_once("../vendor/autoload.php");

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '../');
$dotenv->load();

$config = [
    'base_api_url' => $_ENV['BASE_API_URL'],
    'cache_dir' => $_ENV['CACHE_DIR'],
    'max_cache_age' => $_ENV['MAX_CACHE_AGE']
];

(new \Climbman\ApiMeteoVisualization\Controller($config))->handleRequest();
exit;
