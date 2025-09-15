<?php
require 'db.php';  // Asegúrate que $conn es una instancia PDO

header('Content-Type: application/json');

$sql = "SELECT * FROM productos";
$stmt = $conn->prepare($sql);
$stmt->execute();

$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($productos);
