import express from 'express';
import bodyParser from 'body-parser';
import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const { Pool } = pkg;

// Paso 1: Cargar las variables de entorno desde el archivo .env
dotenv.config();

const app = express();
const port = 3000;

// Paso 2: Configurar bodyParser para manejar datos JSON
app.use(bodyParser.json());

// Paso 3: Configurar la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Servir archivos estáticos desde el directorio 'public'
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// Ruta básica para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta POST /cancion
app.post('/cancion', async (req, res) => {
  const { titulo, artista, tono } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3) RETURNING *',
      [titulo, artista, tono]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al insertar la canción');
  }
});

// Ruta GET /canciones
app.get('/canciones', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM canciones');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener las canciones');
  }
});

// Ruta PUT /cancion/:id
app.put('/cancion/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, artista, tono } = req.body;
  try {
    const result = await pool.query(
      'UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4 RETURNING *',
      [titulo, artista, tono, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar la canción');
  }
});

// Ruta DELETE /cancion
app.delete('/cancion', async (req, res) => {
  const { id } = req.query;
  try {
    const result = await pool.query('DELETE FROM canciones WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      res.status(404).send('Canción no encontrada');
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar la canción');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
