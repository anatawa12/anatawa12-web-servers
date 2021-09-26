<?php

$request = $_SERVER["REQUEST_URI"];
$name = basename($request);
$kind = preg_replace('/^a12-(active|slowly|inactive|archived)-doc$/', '$1', $name);
$url = "https://github.com/anatawa12/anatawa12/blob/master/docs/A12-maintenance-Badges.md#$kind-project";

http_response_code(308);
header("Location: $url");
header("Content-Type: text/plain");

echo "Redirecting to $url";
