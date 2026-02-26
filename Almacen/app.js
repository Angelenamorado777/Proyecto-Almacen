const express = require('express');
const app = express();
const mysql = require('mysql2')
const port = 3000;  

app.use(express.json()); 







app.listen(port, () => {
  console.log(`El servidor está escuchando en http://localhost:${port}`);
}); 