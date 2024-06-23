import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// POST /cancion - Agregar una canción
router.post('/', async (req, res) => {
  // Código para agregar una canción
});

// GET /canciones - Obtener todas las canciones
router.get('/', async (req, res) => {
  // Código para obtener todas las canciones
});

// PUT /cancion/:id - Actualizar una canción por ID
router.put('/:id', async (req, res) => {
  // Código para actualizar una canción por ID
});

// DELETE /cancion?id=:id - Eliminar una canción por ID
router.delete('/', async (req, res) => {
  // Código para eliminar una canción por ID
});

export default router;
