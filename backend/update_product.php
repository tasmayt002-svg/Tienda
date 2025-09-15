<?php
ini_set('display_errors', 0);  // Mejor apagar en producción
error_reporting(0);
header('Content-Type: application/json');

require 'db.php';

try {
    // Obtener datos POST con validación básica
    $id = $_POST['id'] ?? null;
    $nombre = $_POST['nombre'] ?? null;
    $descripcion = $_POST['descripcion'] ?? null;
    $precio = $_POST['precio'] ?? null;
    $categoria = $_POST['categoria'] ?? null;
    $stock = $_POST['stock'] ?? null;

    if (!$id || !$nombre || !$descripcion || !$precio || !$categoria || !$stock) {
        throw new Exception("Faltan datos obligatorios.");
    }

    // Validar que $id y $stock sean numéricos
    if (!is_numeric($id) || !is_numeric($stock) || !is_numeric($precio)) {
        throw new Exception("Datos numéricos inválidos.");
    }

    // Manejo de imagen
    $rutaImagen = null;
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === UPLOAD_ERR_OK) {
        $nombreArchivo = basename($_FILES['imagen']['name']);
        $directorioSubida = __DIR__ . '/uploads/';

        if (!is_dir($directorioSubida)) {
            mkdir($directorioSubida, 0755, true);
        }
        $rutaCompleta = $directorioSubida . $nombreArchivo;

        if (move_uploaded_file($_FILES['imagen']['tmp_name'], $rutaCompleta)) {
            // Ajusta esta ruta si es necesario para que la ruta de imagen sea accesible desde frontend
            $rutaImagen = 'backend/uploads/' . $nombreArchivo;
        } else {
            throw new Exception("Error al subir la imagen.");
        }
    }

    // SQL según si se actualiza imagen o no
    if ($rutaImagen) {
        $sql = "UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria=?, stock=?, imagen_url=? WHERE id=?";
        $params = [$nombre, $descripcion, $precio, $categoria, $stock, $rutaImagen, $id];
    } else {
        $sql = "UPDATE productos SET nombre=?, descripcion=?, precio=?, categoria=?, stock=? WHERE id=?";
        $params = [$nombre, $descripcion, $precio, $categoria, $stock, $id];
    }


    $stmt = $conn->prepare($sql);
    $exito = $stmt->execute($params);

    echo json_encode(['success' => $exito]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
