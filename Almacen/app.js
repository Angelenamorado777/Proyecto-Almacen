const express = require('express');
const app = express();
const mysql = require('mysql2')
const port = 3000;  

app.use(express.json()); 

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_almacen'
});

pool.getConnection((error, conexion) => {
  if (error) {
    console.log('Error de conexión a la base de datos');
  } else {
    console.log('Conexión exitosa');
  }
});

app.post('/api/productos', (req, res) => {
  const producto = req.body;

  if (!producto.nombre || !producto.sku || !producto.precio_compra || !producto.precio_venta) {
    return res.status(400).json({ status: 400, message: 'Todos los campos son obligatorios' });
  } else {
    const sql = `INSERT INTO Productos 
      (nombre, descripcion, sku, precio_compra, precio_venta, stock_minimo, stock_actual, estado, id_categoria, id_proveedor) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(sql, [producto.nombre, producto.descripcion || null, producto.sku, producto.precio_compra, producto.precio_venta, producto.stock_minimo || 0, producto.stock_actual || 0, producto.estado || 'activo', producto.id_categoria || null, producto.id_proveedor || null], (error, result) => {
      if (error) {
        console.log('Existe un error en la consulta SQL');
        res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
      } else {
        producto.id_producto = result.insertId;
        res.status(201).json({ status: 201, message: 'Producto creado exitosamente', data: producto });
      }
    });
  };
});




app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
}); 