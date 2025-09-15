<?php
header('Content-Type: application/json');
require 'db.php';

$id = $_GET['id'] ?? null;

if (!$id) {
  echo json_encode(['success' => false, 'error' => 'ID no proporcionado']);
  exit;
}

$stmt = $conn->prepare("DELETE FROM productos WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(['success' => true]);
} else {
  echo json_encode(['success' => false, 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
