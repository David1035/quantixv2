const express = require('express');

//controladores antiguos (dejados comentados por ahora debio a falla en node)
// const userController = require('./../controllers/user.controller');
// const profileController = require('./../controllers/profile.controller');
// const customerController = require('./../controllers/customer.controller');

// nuevos controladores
const productosController = require('./../productos.controller');
const categoriasController = require('./../categorias.controller');
const authController = require('./../auth.controller');

function isExpressRouter(obj) {
  return obj && (typeof obj === 'function' || typeof obj === 'object') && (obj.stack || obj.handle);
}

function safeMount(router, path, controller, name) {
  if (!controller) {
    console.warn(`Controller ${name} is undefined, skipping mount for ${path}`);
    return;
  }
  if (typeof path === 'string' && /https?:\/\//i.test(path)) {
    console.warn(`Skipping mounting path that looks like a URL: ${path}`);
    return;
  }
  if (isExpressRouter(controller)) {
    router.use(path, controller);
    console.log(`Mounted ${name} at ${path}`);
  } else {
    console.warn(`Controller ${name} does not appear to be an Express Router. Skipping mount at ${path}.`);
  }
}

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  // Montar controladores de forma segura
  safeMount(router, '/productos', productosController, 'productosController');
  safeMount(router, '/categorias', categoriasController, 'categoriasController');
  safeMount(router, '/login', authController, 'authController');

  // depuración
  console.log('Montando rutas...');
  console.log('/productos ->', isExpressRouter(productosController) ? 'Router' : typeof productosController);
  console.log('/categorias ->', isExpressRouter(categoriasController) ? 'Router' : typeof categoriasController);
  console.log('/login ->', isExpressRouter(authController) ? 'Router' : typeof authController);

  // Middleware para manejar errores
  router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  // Middleware para manejar rutas no definidas
  router.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });
}

module.exports = routerApi;
