CREATE DATABASE IF NOT EXISTS micelio;
USE micelio;

CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    imagen_url VARCHAR(255),
    categoria VARCHAR(100),
    stock INT DEFAULT 0
);
