const express = require('express');
const router = express.Router();

// usuario de prueba en memoria
const user = { username: 'admin', password: '1234' };

// POST login
router.post('/', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    return res.json({ message: 'Login exitoso', token: 'fake-jwt-token' });
  }
  res.status(401).json({ error: 'Credenciales inválidas' });
});

// Verifica que todas las rutas dinámicas estén correctamente definidas
router.get('/:id', (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'ID no proporcionado' });
  }
  res.json({ message: `Ruta dinámica con ID: ${id}` });
});

console.log('AuthController cargado');
module.exports = router;
