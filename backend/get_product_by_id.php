<?php
require 'db.php';

$id = $_GET['id'];
$sql = "SELECT * FROM productos WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$id]);

if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
  echo json_encode($row);
} else {
  echo json_encode(['error' => 'Producto no encontrado']);
}
?>
