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
            echo json_encode(['error' => true, 'error_name' => 'failed to fetch url contents']);
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
    
    default:
        echo json_encode(['error' => true, 'error_name' => 'unrecognized command']);
        break;
}
?>
