<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if (isset($_GET["city"]) && !empty($_GET["city"])) {
    $city = urlencode(trim(strip_tags($_GET["city"])));
    $url = "https://nominatim.openstreetmap.org/search?city=$city&format=json&limit=10&addressdetails=1";
    $context = stream_context_create([
        "http" => [
            "header" => "User-Agent: Wacdo/1.0\r\n"
        ]
    ]);

    $location = file_get_contents($url, false, $context);
    if ($location === false) {
        echo json_encode(["error" => "Aucune réponse de Nominatim!"]);
        exit();
    } else {
        echo $location;
    }
}