const express = require('express');
const router = express.Router();

// memoria temporal
let categorias = ['Electrónica', 'Ropa', 'Alimentos'];

// GET todas
router.get('/', (req, res) => {
  res.json(categorias);
});

// GET por nombre
router.get('/:nombre', (req, res) => {
  const { nombre } = req.params;
  if (!categorias.includes(nombre)) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }
  res.json({ message: 'Categoría encontrada', nombre });
});

// POST nueva
router.post('/', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre requerido' });

  if (categorias.includes(nombre)) {
    return res.status(400).json({ error: 'La categoría ya existe' });
  }

  categorias.push(nombre);
  res.json({ message: 'Categoría agregada', nombre });
});

// DELETE por nombre
router.delete('/:nombre', (req, res) => {
  const { nombre } = req.params;
  if (!categorias.includes(nombre)) {
    return res.status(404).json({ error: 'Categoría no encontrada' });
  }
  categorias = categorias.filter(c => c !== nombre);
  res.json({ message: 'Categoría eliminada', nombre });
});

console.log('CategoriasController cargado');
module.exports = router;
