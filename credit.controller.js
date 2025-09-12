const express = require('express');
const router = express.Router();

// memoria temporal para créditos
let credits = [];

// GET todos los créditos
router.get('/', (req, res) => {
  res.json(credits);
});

// GET por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const credit = credits.find(c => c.id == id);
  if (!credit) return res.status(404).json({ error: 'Crédito no encontrado' });
  res.json(credit);
});

// POST crear crédito
router.post('/', (req, res) => {
  const { amount, userId } = req.body;
  if (amount == null) return res.status(400).json({ error: 'amount es requerido' });
  const id = credits.length ? credits[credits.length - 1].id + 1 : 1;
  const nuevo = { id, amount, userId };
  credits.push(nuevo);
  res.json(nuevo);
});

// PUT actualizar
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const index = credits.findIndex(c => c.id == id);
  if (index === -1) return res.status(404).json({ error: 'Crédito no encontrado' });
  credits[index] = { ...credits[index], ...req.body };
  res.json(credits[index]);
});

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const before = credits.length;
  credits = credits.filter(c => c.id != id);
  if (credits.length === before) return res.status(404).json({ error: 'Crédito no encontrado' });
  res.json({ message: 'Crédito eliminado' });
});

console.log('CreditController cargado');
module.exports = router;



