CREATE DATABASE IF NOT EXISTS db_almacen;
USE db_almacen;


-- Organiza los productos en grupos
-- Cada categoría tiene un nombre obligatorio y una descripción opcional.
CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre ENUM('Limpieza', 'Alimentos', 'Electrónica') NOT NULL,
    descripcion TEXT
);

-- Almacena la información de los proveedores que suministran los productos:
-- nombre/razón social, teléfono, correo y ciudad de ubicación.
CREATE TABLE Proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_razon_social VARCHAR(150) NOT NULL,
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion_ciudad VARCHAR(150)
);

-- Registra las personas que usan el sistema.
-- Rol: 'Administrador' (acceso total) o 'Vendedor' (acceso limitado).
-- Estado: permite activar o desactivar usuarios sin eliminarlos.
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    rol ENUM('Administrador', 'Vendedor') NOT NULL,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
);


-- Tabla central del sistema. Guarda la información completa de cada producto:
-- nombre, SKU (Stock keeping unit código único), precios de compra/venta, niveles de stock 
-- y sus relaciones con una categoría y un proveedor.
CREATE TABLE Productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    sku VARCHAR(50) UNIQUE NOT NULL,
	precio_compra DECIMAL(10,2) NOT NULL CHECK (precio_compra > 0),  
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta > 0),
    stock_minimo INT DEFAULT 0,
    stock_actual INT DEFAULT 0,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    id_categoria INT,
    id_proveedor INT,
    FOREIGN KEY (id_categoria) REFERENCES Categorias(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedores(id_proveedor)
);


-- Historial de cambios de stock. Cada registro representa una entrada
-- (llegada de mercancía) o salida (venta/consumo) de un producto.
-- Siempre queda registrado qué usuario realizó el movimiento y cuándo.
CREATE TABLE Movimientos_Inventario (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    fecha_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario)
);

