const express = require('express');
const app = express();
const mysql = require('mysql2')
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'Hola',
  password: 'Hola123',
  database: 'db_almacen'
});

pool.getConnection((error, conexion) => {
  if (error) {
    console.log('Error de conexión a la base de datos');
  } else {
    console.log('Conexion exitosa');
  }
});

app.get('/api/productos', (req, res) => {

  const sql = "SELECT * FROM Productos";

  pool.query(sql, (error, results) => {
    if (error) {
      console.log('Existe un error en la consulta SQL');
      return res.status(500).json({ message: 'Error en la consulta SQL' });
    } else {
      res.status(200).json({ status: 200, message: 'Success', data: results });
    }
  });
});

//Get por id
app.get('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM Productos WHERE id_producto = ?';
  pool.query(sql, [id], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ mensaje: 'Error al buscar el producto en la base de datos' });
    }
    if (results.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontro el producto' });
    }
    res.json(results[0]);
  });
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

app.put('/api/productos/:id', (req, res) => {
  const id = req.params.id;
  const producto = req.body;

  const sql = `UPDATE Productos SET nombre = ?, descripcion = ?, sku = ?, precio_compra = ?, precio_venta = ?, stock_minimo = ?, stock_actual = ?, estado = ?, id_categoria = ?, id_proveedor = ? WHERE id_producto = ?`;

  pool.query(sql, [producto.nombre, producto.descripcion || null, producto.sku, producto.precio_compra, producto.precio_venta, producto.stock_minimo || 0, producto.stock_actual || 0, producto.estado || 'activo', producto.id_categoria || null, producto.id_proveedor || null, id], (error, result) => {
    if (error) {
      console.log('Existe un error en la consulta SQL');
      res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
    } else {
      if (result.affectedRows === 0) {
        res.status(404).json({ status: 404, message: 'Producto no encontrado' });
      } else {
        producto.id_producto = id;
        res.status(200).json({ status: 200, message: 'Producto actualizado exitosamente', data: producto });
      }
    }
  });
});

// delete

app.delete('/api/productos/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const producto = req.body
  // Se realizo el cambio de estatus logico 
  const sql = `UPDATE Productos SET estado = 'inactivo' WHERE id_producto = ?`;

  pool.query(sql, [id,producto.estado], (error, result) => {
    if (error) {
      console.log('Existe un error en la consulta SQL');
      res.status(500).json({ status: 500, message: 'Error en la consulta SQL' });
    }
    else {
      if (result.affectedRows === 0) {
        res.status(404).json({ status: 404, message: 'Producto no encontrado' });
      }
      else {
        res.status(200).json({ status: 200, message: 'Cambios de estado exitoso'});
      }
    }
  });

})

app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
}); 