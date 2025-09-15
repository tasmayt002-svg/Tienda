<?php
header('Content-Type: application/json');
require 'db.php';

// Verificar si se subió un archivo
if (!isset($_FILES['imagen'])) {
  echo json_encode(['success' => false, 'error' => 'No se subió imagen']);
  exit;
}

$uploadDir = '../uploads/';
if (!is_dir($uploadDir)) {
  mkdir($uploadDir, 0777, true);
}

$imagenNombre = basename($_FILES['imagen']['name']);
$imagenRuta = $uploadDir . $imagenNombre;
$imagenWebPath = '../uploads/' . $imagenNombre;

if (!move_uploaded_file($_FILES['imagen']['tmp_name'], $imagenRuta)) {
  echo json_encode(['success' => false, 'error' => 'Error al subir la imagen']);
  exit;
}

// Capturar los demás datos del formulario
$nombre = $_POST['nombre'];
$descripcion = $_POST['descripcion'];
$precio = $_POST['precio'];
$categoria = $_POST['categoria'];
$stock = $_POST['stock'];

// Guardar en la base de datos
$stmt = $conn->prepare("INSERT INTO productos (nombre, descripcion, precio, imagen_url, categoria, stock) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdssi", $nombre, $descripcion, $precio, $imagenWebPath, $categoria, $stock);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
