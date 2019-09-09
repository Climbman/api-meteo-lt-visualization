<?php

if (!isset($_GET['cmd'])) {
    echo json_encode(['error' => true, 'error_name' => 'no cmd']);
    exit;
}

switch ($_GET['cmd']) {
    case '1':
        if (!isset($_GET['search_phrase'])) {
            echo json_encode(['error' => true, 'error_name' => 'no search phrase']);
            break;
        }

        $url = 'https://api.meteo.lt/v1/places';

        $content = file_get_contents($url);

        if ($content == false) {
            echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
            break;
        }

        if (!$places_array = json_decode($content)) {
            echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
            break;
        }

        $word = strtolower($_GET['search_phrase']);
        $len = strlen($word);
        $matches = array();
        foreach ($places_array as $obj) {
            if (stristr($word, substr($obj->code, 0, $len))) {
                $matches[] = $obj->code;
            }
        }

        echo json_encode(['error' => false, 'matches' => $matches]);
        break;
    
    default:
        echo json_encode(['error' => true, 'error_name' => 'unrecognized command']);
        break;
}
?>
