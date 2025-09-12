const express = require('express');
const cors = require('cors');
const { logErrors, ormErrorHandler, boomErrorHandler, errorHandler } = require('./middlewares/error.handler')
const fs = require('fs');
const path = require('path');

const app = express();

// Protección: envolver app.use para ignorar mounts que pasen una URL como primer argumento
(function wrapAppUse() {
  const originalUse = app.use.bind(app);
  app.use = function(...args) {
    try {
      const first = args[0];
      if (typeof first === 'string' && /https?:\/\//i.test(first)) {
        console.warn('Skipping app.use with URL-like path:', first);
        return app; // no-op
      }
    } catch (e) {}
    return originalUse(...args);
  }
})();

app.use(express.json())
app.use(cors())

// Escanear archivos en busca de URLs (excluye node_modules)
function scanForUrls(rootDir) {
  const results = [];
  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const full = path.join(dir, file);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          if (file === 'node_modules' || file === '.git') continue;
          walk(full);
        } else if (/\.(js|json|html|env|jsx|ts)$/.test(file)) {
          const content = fs.readFileSync(full, 'utf8');
          const lines = content.split(/\r?\n/);
          lines.forEach((ln, i) => {
            if (/https?:\/\//i.test(ln)) {
              results.push({ file: full, line: i+1, text: ln.trim() });
            }
          });
        }
      } catch (e) {
        // ignore
      }
    }
  }
  try {
    walk(rootDir);
  } catch (e) {}
  if (results.length) {
    console.warn('Found URL-like strings in project files:');
    results.forEach(r => console.warn(`${r.file}:${r.line} -> ${r.text}`));
  } else {
    console.log('No URL-like strings found (excluding node_modules).');
  }
  return results;
}

// Run scan early
scanForUrls(path.join(__dirname));

// Instrumentación para depurar definiciones de rutas problemáticas
(function patchRouterLogging() {
  try {
    const methods = ['use','get','post','put','delete','patch'];
    methods.forEach(m => {
      const orig = express.Router.prototype[m];
      if (!orig) return;
      express.Router.prototype[m] = function(...args) {
        try {
          const first = args[0];
          if (typeof first === 'string') {
            console.log(`Router.${m} called with path: ${first}`);
            if (/https?:\/\//i.test(first)) {
              console.warn(`Router.${m} mounted a URL-like path: ${first} -> SKIPPING to avoid path parsing error`);
              return this; // skip mounting URL-like paths
            }
          } else if (first && first.name) {
            console.log(`Router.${m} called with handler: ${first.name}`);
          } else {
            console.log(`Router.${m} called with arg type: ${typeof first}`);
          }
          // show brief stack to find caller
          const stack = (new Error()).stack.split('\n').slice(2,10).join('\n');
          console.log(stack);
        } catch (e) {
          // ignore
        }
        try {
          // Filter out any string arguments that look like URLs to avoid path-to-regexp errors
          const removed = [];
          const safeArgs = args.filter(a => {
            if (typeof a === 'string' && /https?:\/\//i.test(a)) {
              removed.push(a);
              return false;
            }
            return true;
          });
          if (removed.length) {
            console.warn(`Router.${m} removed URL-like args before mounting:`, removed);
          }
          if (safeArgs.length === 0) return this; // nothing safe to mount
          return orig.apply(this, safeArgs);
        } catch (err) {
          try {
            console.error(`Error while calling Router.${m} with args:`, args.map(a => (typeof a === 'string' ? a : (a && a.name) ? a.name : typeof a)));
            console.error('Caller stack:\n', (new Error()).stack.split('\n').slice(2,10).join('\n'));
          } catch (e) {}
          throw err;
        }
      }
    });
  } catch (e) {
    console.error('Failed to patch router methods', e);
  }
})();

// Servir archivos estáticos de public_html
app.use(express.static(path.join(__dirname, 'public_html')));

// Si no encuentra una ruta de API, devolver index.html (útil para frontend completo)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Cargar y montar rutas de forma segura ahora que los wrappers están activos
try {
  const routerApi = require('./routes');
  if (routerApi && typeof routerApi === 'function') {
    routerApi(app);
    console.log('Rutas montadas con routerApi');
  } else {
    console.warn('routes/index.js no exporta una función routerApi. No se montaron rutas.');
  }
} catch (e) {
  console.error('Error cargando o montando rutas:', e && e.stack ? e.stack : e);
}

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Cualquier ruta que no sea API devolverá index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Agrego manejo global de errores para evitar que la app termine sin información
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

async function startServer() {
  try {
    // ...existing code that initializes DB/Sequelize (if any)...
    if (typeof initializeDatabase === 'function') {
      try {
        await initializeDatabase();
        console.log('Base de datos inicializada correctamente');
      } catch (err) {
        console.error('Error inicializando la base de datos (continuando):', err && err.message ? err.message : err);
      }
    }
  } catch (err) {
    console.error('Error en la fase de arranque:', err);
  }

  try {
    // ...existing code that starts the express server, e.g. app.listen(...) ...
    if (typeof app !== 'undefined' && app && app.listen) {
      const port = process.env.PORT || 3000;
      app.listen(port, () => console.log(`Server listening on port ${port}`));
    }
  } catch (err) {
    console.error('Error arrancando el servidor:', err);
  }
}

startServer();
