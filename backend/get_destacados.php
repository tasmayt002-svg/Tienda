<?php
require_once 'db.php';

$sql = "SELECT * FROM productos WHERE destacado = 1";
$result = $conn->query($sql);

$productos = [];

while($row = $result->fetch_assoc()) {
  $productos[] = $row;
}

header('Content-Type: application/json');
echo json_encode($productos);

$conn->close();
