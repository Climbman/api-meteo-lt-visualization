<?php
$url = 'https://api.meteo.lt/v1/places';

$content = file_get_contents($url);

if ($content == false) {
    echo json_encode(['error' => 'true', 'error_name' => 'failed to fetch url contents']);
    exit;
}

if (!$places_array = json_decode($content)) {
    echo json_encode(['error' => 'true', 'error_name' => 'failed to fetch url contents']);
    exit;
}



?>
