<?php
$filename = basename($_GET['img']); // Sanitiza entrada
$path = realpath(__DIR__ . "/../uploads/" . $filename);

if ($path && file_exists($path)) {
    $mime = mime_content_type($path);
    header("Content-Type: $mime");
    readfile($path);
    exit;
} else {
    http_response_code(404);
    echo "Imagen no encontrada.";
}
