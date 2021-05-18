<?php declare(strict_types=1);

namespace Climbman\ApiMeteoVisualization;


class Controller
{
    private array $config;


    public function __construct(array $config)
    {
        $this->config = $config;
    }

    public function handleRequest(): void
    {

    }

    private function handleGetRequest($_config): void
    {
        switch ($_GET['cmd']) {
            //place name retrieval and search
            case 'places':

                $url = $_config['api_address'] . 'v1/places';
                $file = $_config['cache_path'] . 'places.json';

                $content = getContentFromCacheOrRemote($file, $_config, $url);

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
            case 'forecasts':
                $places_array = '';
                $match = false;

                if (!isset($_GET['place']) || empty($_GET['place'])) {
                    echo json_encode(['error' => true, 'error_name' => 'no place given']);
                    break;
                }

                $url = $_config['api_address'] . 'v1/places/' . urlencode($_GET['place']) . '/forecasts/long-term';
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

                $content = getContentFromCacheOrRemote($file, $_config, $url);

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
    }

    /**
     * @param $file
     * @param $_config
     * @param $url
     * @return false|string
     */
    private function getContentFromCacheOrRemote($file, $_config, $url)
    {
        if (!file_exists($file) || filemtime($file) + $_config < time()) {
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

        return $content;
    }
}