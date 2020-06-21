<?php

$_config['max_file_age'] = 10800;
$_config['cache_path'] = 'cache/';
$_congig['api_address'] = 'https://api.meteo.lt/';

if (!isset($_GET['cmd'])) {
    echo json_encode(['error' => true, 'error_name' => 'no cmd']);
    exit;
}

switch ($_GET['cmd']) {
    //place name retrieval and search
    case '1':

        $url = $_congig['api_address'] . 'v1/places';
        $file = $_config['cache_path'] . 'places.json';
        
        $content = '';
        if (!file_exists($file) || filemtime($file) + $_config['max_file_age'] < time()) {
            $handle = fopen($file, 'w');
            $content = file_get_contents($url);

            if ($content == false) {
                echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
                exit;
            }

            fwrite($handle, $content);
            fclose($handle);
        } else {
            $content = file_get_contents($file);
        }


        if (!$places_array = json_decode($content)) {
            echo json_encode(['error' => true, 'error_name' => 'failure parsing json']);
            break;
        }

        $places = [];
        foreach ($places_array as $obj) {
                $matches[$obj->code] = $obj->name;
        }

        echo json_encode(['error' => false, 'places' => $matches]);
        break;
    case '2':
        $places_array = '';
        $match = false;
    
        if (!isset($_GET['place']) || empty($_GET['place'])) {
            echo json_encode(['error' => true, 'error_name' => 'no place given']);
            break;
        }
        
        $url = $_congig['api_address'] . 'v1/places/' . urlencode($_GET['place']) . '/forecasts/long-term';
        $places_file = $_config['cache_path'] . 'places.json';
        
        if (!$places_content = file_get_contents($places_file)) {
            echo json_encode(['error' => true, 'error_name' => 'no places file']);
            break;
        }
        
        if (!$places_array = json_decode($places_content)) {
            echo json_encode(['error' => true, 'error_name' => 'failure decoding json']);
            break;
        }
        
        //May delete later or replace with response interpretation from meteo api
        foreach ($places_array as $place) {
            if ($place->code === strtolower($_GET['place'])) {
                $match = true;
            }
        }
        
        if (!$match) {
            echo json_encode(['error' => true, 'error_name' => 'illegal place']);
            break;
        }

        $file = 'cache/' . $_GET['place'] . '.json';

        $content = null;
        if (!file_exists($file) || filemtime($file) + $_config['max_file_age'] < time()) {
            $handle = fopen($file, 'w');
            $content = file_get_contents($url);

            if (!$content) {
                echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
                exit;
            }

            fwrite($handle, $content);
            fclose($handle);
        } else {
            $content = file_get_contents($file);
        }

        if (!$content) {
            echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
            exit;
        }
        
        if (!$forecast_array = json_decode($content)) {
            echo json_encode(['error' => true, 'error_name' => 'failure parsing json']);
            break;
        }
        
        $data_points = $forecast_array->forecastTimestamps;
        
        echo json_encode($data_points);
        break;
    
    default:
        echo json_encode(['error' => true, 'error_name' => 'unrecognized command']);
        break;
}
