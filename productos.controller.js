const express = require('express');
const router = express.Router();

// memoria temporal (cámbialo luego a DB)
let productos = [
  { id: 1, nombre: 'Laptop', cantidad: 5, categoria: 'Electrónica', precio: 1200, fecha: '2025-09-10' }
];

// GET todos
router.get('/', (req, res) => {
  res.json(productos);
});

// GET por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const producto = productos.find(p => p.id == id);
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
});

// POST nuevo
router.post('/', (req, res) => {
  const { nombre, cantidad, categoria, precio, fecha } = req.body;
  if (!nombre || !cantidad || !categoria || !precio || !fecha) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  const id = productos.length ? productos[productos.length - 1].id + 1 : 1;
  const nuevo = { id, nombre, cantidad, categoria, precio, fecha };
  productos.push(nuevo);
  res.json(nuevo);
});

// PUT modificar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = productos.findIndex(p => p.id == id);
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

  productos[index] = { ...productos[index], ...req.body };
  res.json(productos[index]);
});

// DELETE eliminar
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  productos = productos.filter(p => p.id != id);
  res.json({ message: 'Producto eliminado' });
});

// ✅ Log correcto para depuración
console.log('ProductosController cargado');

module.exports = router;
