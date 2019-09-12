<?php

if (!isset($_GET['cmd'])) {
    echo json_encode(['error' => true, 'error_name' => 'no cmd']);
    exit;
}

switch ($_GET['cmd']) {
    //place name retrieval and search
    case '1':
        if (!isset($_GET['search_phrase'])) {
            echo json_encode(['error' => true, 'error_name' => 'no search phrase']);
            break;
        }

        $url = 'https://api.meteo.lt/v1/places';
        $file = 'cache/places.json';
        
        $content = '';
        if (!file_exists($file) || filemtime($file) + 600 < time()) {
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

        $word = strtolower($_GET['search_phrase']);
        if (trim($word) == '') {
            $word = 'abc';
        }
        $len = strlen($word);
        $matches = array();
        foreach ($places_array as $obj) {
            if (stristr($word, substr($obj->code, 0, $len))) {
                $matches[] = $obj->code;
            }
        }

        echo json_encode(['error' => false, 'matches' => $matches]);
        break;
    case '2':
        $places_array = '';
        $match = false;
    
        if (!isset($_GET['place']) || empty($_GET['place'])) {
            echo json_encode(['error' => true, 'error_name' => 'no place given']);
            break;
        }
        
        $url = 'https://api.meteo.lt/v1/places/' . urlencode($_GET['place']) . '/forecasts/long-term';
        $places_file = 'cache/places.json';
        
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
        
        //TODO: implement cache if necessary
        $forecast_content = file_get_contents($url);

        if ($forecast_content == false) {
            echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
            exit;
        }
        
        if (!$forecast_array = json_decode($forecast_content)) {
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
?>
