# Quantixv2

## 🧭 Descripción General
**Quantixv2** es una API RESTful desarrollada en **Node.js** con **Express** y **Sequelize**, diseñada para la **gestión de datos** y **autenticación de usuarios** sobre una base de datos **PostgreSQL**.  
El proyecto está preparado para ejecutarse mediante **Docker Compose**, e incluye una configuración de entorno flexible mediante archivos `.env`.

Esta arquitectura está pensada para escalar fácilmente y ser consumida por frontends modernos (React, Vue, Angular o Vanilla JS), garantizando seguridad, mantenibilidad y separación de responsabilidades.

---

## 🧱 Arquitectura del Proyecto

```plaintext
quantixv2/
├── config/              # Configuración general (DB, CORS, JWT, etc.)
├── controllers/         # Controladores: lógica para cada recurso
├── db/                  # Inicialización de Sequelize, modelos y migraciones
├── libs/                # Librerías auxiliares o personalizadas
├── middlewares/         # Middlewares de Express (auth, logs, validaciones)
├── routes/              # Definición de rutas API (agrupadas por recurso)
├── schemas/             # Validaciones y estructuras de datos
├── services/            # Lógica de negocio y conexión entre modelo y controlador
├── utils/auth/          # Utilidades de autenticación (JWT, hashing, verificación)
├── docker-compose.yml   # Orquestación de contenedores
├── .envModel            # Plantilla base para configuración de entorno
├── package.json         # Dependencias y scripts del proyecto
└── index.js             # Punto de entrada del servidor Express
```

---

## ⚙️ Instalación y Configuración

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/David1035/quantixv2.git
cd quantixv2
```

### 2️⃣ Configurar Variables de Entorno
Copia el archivo `.envModel` como `.env` y completa los valores según tu entorno:
```bash
cp .envModel .env
```

Ejemplo:
```plaintext
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=quantixdb
JWT_SECRET=mi_super_secreto
```

### 3️⃣ Instalar Dependencias
```bash
npm install
```

### 4️⃣ Ejecutar con Node.js
```bash
npm start
```

### 5️⃣ (Opcional) Ejecutar con Docker
```bash
docker-compose up --build
```
Esto levantará los contenedores definidos (API + PostgreSQL + pgAdmin si está configurado).

---

## 🧩 Variables de Entorno Principales

| Variable      | Descripción                                  |
| ------------- | -------------------------------------------- |
| `PORT`        | Puerto del servidor Express                  |
| `DB_HOST`     | Host del servidor PostgreSQL                 |
| `DB_PORT`     | Puerto de PostgreSQL (default 5432)          |
| `DB_USER`     | Usuario de la base de datos                  |
| `DB_PASSWORD` | Contraseña del usuario                       |
| `DB_NAME`     | Nombre de la base de datos                   |
| `JWT_SECRET`  | Secreto para la firma de tokens JWT          |
| `NODE_ENV`    | Modo de ejecución (development / production) |

---

## 🚀 Endpoints Principales

> **Nota:** Todos los endpoints que requieren autenticación deben enviar el encabezado:
> ```
> Authorization: Bearer <tu_token_JWT>
> ```

### 🔐 Autenticación

| Método | Ruta                 | Descripción                        | Auth |
| ------ | -------------------- | ---------------------------------- | ---- |
| `POST` | `/api/auth/register` | Registrar un nuevo usuario         | No   |
| `POST` | `/api/auth/login`    | Iniciar sesión y obtener token JWT | No   |

#### Ejemplo de `POST /api/auth/login`
**Request Body**
```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```
**Response 200**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@correo.com",
    "name": "Usuario de Ejemplo"
  }
}
```

---

### 👥 Usuarios

| Método   | Ruta             | Descripción                 | Auth |
| -------- | ---------------- | --------------------------- | ---- |
| `GET`    | `/api/users`     | Obtener todos los usuarios  | Sí   |
| `GET`    | `/api/users/:id` | Obtener usuario por ID      | Sí   |
| `PUT`    | `/api/users/:id` | Actualizar datos de usuario | Sí   |
| `DELETE` | `/api/users/:id` | Eliminar usuario            | Sí   |

---

### 📦 Recursos Genéricos (Ejemplo)

| Método   | Ruta             | Descripción            | Auth |
| -------- | ---------------- | ---------------------- | ---- |
| `GET`    | `/api/items`     | Listar todos los items | Sí   |
| `POST`   | `/api/items`     | Crear nuevo item       | Sí   |
| `GET`    | `/api/items/:id` | Obtener un item por ID | Sí   |
| `PUT`    | `/api/items/:id` | Actualizar item        | Sí   |
| `DELETE` | `/api/items/:id` | Eliminar item          | Sí   |

> 📘 *Revisa la carpeta `routes/` para ver todos los endpoints implementados y extender esta documentación según tus entidades.*

---

## 🔑 Autenticación y Seguridad

El proyecto usa **JWT (JSON Web Tokens)** para autenticación y autorización:
- **Registro:** guarda contraseñas hasheadas con bcrypt.
- **Login:** valida credenciales, genera un JWT firmado con `JWT_SECRET`.
- **Middleware:** protege rutas verificando el token recibido en el header `Authorization`.

### Flujo:
1. Usuario se registra o inicia sesión.
2. Servidor responde con un token JWT.
3. El cliente guarda el token en `localStorage` o `sessionStorage`.
4. En cada solicitud protegida, envía el token con:
   ```
   Authorization: Bearer <token>
   ```
5. El middleware `authHandler` valida el token antes de acceder al recurso.

---

## 🗃️ Base de Datos (PostgreSQL + Sequelize)

- **ORM:** Sequelize
- **Driver:** pg / pg-hstore
- **Conexión:** configurada en `config/` o `db/`
- **Modelos:** definidos en `db/models/`
- **Migraciones:** si aplican, se ejecutan antes de iniciar el servidor

Ejemplo básico de modelo:
```js
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING }
});
```

---

## 🧰 Middlewares Principales

| Middleware            | Función                                       |
| --------------------- | --------------------------------------------- |
| `authHandler.js`      | Verifica tokens JWT y protege rutas           |
| `errorHandler.js`     | Centraliza manejo de errores                  |
| `validatorHandler.js` | Valida datos de entrada según esquemas        |
| `cors.js`             | Configura CORS para peticiones desde frontend |

---

## 🧪 Scripts de NPM

| Script         | Descripción                                       |
| -------------- | ------------------------------------------------- |
| `npm start`    | Inicia el servidor en modo producción             |
| `npm run dev`  | Inicia con nodemon para desarrollo                |
| `npm test`     | Ejecuta pruebas (si están configuradas)           |
| `npm run lint` | Ejecuta el linter para verificar estilo de código |

---

## 🧭 Cómo trabajar el Frontend con este Backend

Aunque el repositorio no incluye frontend, el backend está **completamente preparado para integrarse con un cliente** en React, Vue o cualquier otro framework.

### Recomendaciones:
1. **Crear un cliente separado** (por ejemplo, `quantix-client`) y definir variables globales de API.
2. **Configurar CORS** en el backend (`cors()` de Express) para aceptar peticiones del dominio del frontend.
3. **Manejar autenticación**:
   - Guardar el JWT en `localStorage` o cookies seguras.
   - Enviar el token en cada petición:
     ```js
     const token = localStorage.getItem("token");
     fetch(`${API_URL}/api/users`, {
       headers: { Authorization: `Bearer ${token}` }
     });
     ```
4. **Estructura sugerida del cliente:**
   ```plaintext
   src/
   ├── api/             # funciones fetch/Axios para consumir la API
   ├── components/      # componentes reutilizables
   ├── pages/           # vistas (login, dashboard, etc.)
   ├── context/         # manejo global de sesión (AuthContext)
   └── utils/           # helpers y configuración
   ```
5. **Ciclo típico:**
   - Login → guardar token → acceder a dashboard → consumir endpoints.
   - Logout → eliminar token → redirigir a login.
6. **Seguridad:**
   - Validar campos antes de enviar.
   - Manejar errores de token expirado (`401 Unauthorized`).

---

## 🧾 Mejores Prácticas y Extensiones

- Implementar documentación Swagger (`swagger-ui-express`).
- Usar `helmet` para seguridad HTTP.
- Añadir pruebas unitarias con Jest o Mocha.
- Configurar GitHub Actions para CI/CD.
- Implementar versionamiento de API (`/api/v1/`).

---

## 👨‍💻 Autor
**Nelson David Hernández Gómez**  
Desarrollador Backend y Frontend  
📧 [davyd2h@gmail.com](mailto:davyd2h@gmail.com)  
🔗 [GitHub: David1035](https://github.com/David1035)

---

## 🧰 Tecnologías utilizadas

### Backend

- **Node.js** – Entorno de ejecución de JavaScript en servidor.
- **Express** – Framework para construir la API REST (`/api/v1/...`).
- **PostgreSQL** – Motor de base de datos relacional.
- **Sequelize** – ORM para modelar entidades y relaciones:
  - `User`, `Profile`, `Customer`, `Product`, `Category`
  - `Supplier`, `ProductSupplier`
  - `Sale`, `DetailSale`, `Invoice`
  - `Credit`, `CreditPayments`
- **Passport** – Middleware de autenticación:
  - `passport-local` para login con **email / password**.
  - `passport-jwt` para validar tokens JWT en rutas protegidas.
- **jsonwebtoken** – Generación y firma de tokens JWT.
- **bcrypt** – Hash de contraseñas antes de persistir en base de datos.
- **Joi** – Validación de datos de entrada (body, params) en cada endpoint.
- **@hapi/boom** – Manejo consistente de errores HTTP.
- **dotenv / dotenvx** – Gestión de variables de entorno (`.env`).
- **nodemon** (dev) – Recarga automática del servidor en desarrollo.

### Frontend

- **HTML5** – Vistas desacopladas por módulo:
  - `login.html`, `index.html`, `users.html`, `profiles.html`,
    `customers.html`, `credits.html`, `credit-payments.html`,
    `categories.html`, `products.html`, `suppliers.html`,
    `product-suppliers.html`, `ingresos.html`, `sales.html`, etc.
- **CSS3** (sin framework) – Hoja de estilos única:
  - Layout con sidebar, topbar y tarjetas (`.sidebar`, `.topbar`, `.card`).
  - Sistema de grillas (`.grid-2`, `.grid-3`, `.grid-4`) y utilidades (`.mt-8`, `.mt-16`, `.muted`).
- **JavaScript (ES Modules)** – Frontend modular y sin framework:
  - `assets/js/apiConfig.js` – `API_BASE`, `endpoints`, helpers de JWT.
  - `assets/js/guard.js` – `requireAuth()` y `logout()`.
  - Módulos por entidad:
    - `users.controller.js` / `users.service.js`
    - `profiles.controller.js` / `profiles.service.js`
    - `customers`, `credits`, `credit-payments`
    - `categories`, `products`
    - `suppliers`, `product-suppliers`
    - `ingresos.controller.js` / `ingresos.service.js`
  - Consumo del backend mediante **Fetch API** (`fetch`) y JSON.
  - Gestión de sesión con **localStorage** (`quantix_token`, `currentUser`).

---

## 🔐 Estrategia de autenticación y autorización

La seguridad de Quantixv2 se basa en una combinación de **login con credenciales** y **tokens JWT**:

1. **Login (Autenticación inicial)**  
   - Endpoint: `POST /api/v1/auth/login`
   - Implementado con `passport-local`:
     - Campo de usuario: `email`
     - Campo de contraseña: `password`
   - Flujo:
     1. El usuario envía `email` y `password`.
     2. Se busca el usuario con `UserService.findByEmail(email)`.
     3. Se compara la contraseña con `bcrypt.compare(password, user.password)`.
     4. Si las credenciales son válidas:
        - Se elimina `password` del objeto de usuario.
        - Se genera un **JWT** con `jsonwebtoken.sign()`:
          ```js
          const payload = { sub: user.id, role: user.role };
          const token = jwt.sign(payload, config.jwtSecret);
          ```
        - El backend responde con:
          ```json
          {
            "user": { ...sin password },
            "token": "<JWT>"
          }
          ```

2. **Protección de rutas (JWT)**  
   - Estrategia `passport-jwt`:
     - Extrae el token del header: `Authorization: Bearer <token>`.
     - Valida y decodifica usando `config.jwtSecret`.
   - Rutas protegidas usan:
     ```js
     passport.authenticate('jwt', { session: false })
     ```
   - El payload (`sub`, `role`) queda disponible en `req.user`.

3. **Control de roles (`checkARoles`)**  
   - Middleware personalizado para autorización por rol:
     ```js
     checkARoles('admin', 'administrador')
     ```
   - Se aplica en módulos sensibles como **perfiles**, créditos, etc.
   - Permite restringir acciones (crear, actualizar, eliminar) según el `role` del usuario.

4. **Gestión de sesión en el frontend**  
   - Al hacer login, el frontend:
     - Guarda el token en `localStorage`:
       ```js
       setToken(data.token); // 'quantix_token'
       localStorage.setItem("currentUser", JSON.stringify(data.user));
       ```
     - Redirige a `index.html` (dashboard).
   - Todas las peticiones posteriores añaden:
     ```js
     headers: {
       Authorization: `Bearer ${token}`,
       ...
     }
     ```
     mediante `authHeaders()` en `apiConfig.js`.
   - Cada vista protegida llama a `requireAuth()` (en `guard.js`):
     - Si no hay token válido en `localStorage`, redirige a `login.html`.

5. **Cierre de sesión (logout)**  
   - Botón "Cerrar sesión" en el frontend:
     - Limpia el token y el usuario actual de `localStorage`.
     - Redirige al formulario de login.
   - Implementado con `logout()` en `guard.js`.

Esta estrategia garantiza que:

- Sólo usuarios autenticados pueden consumir los endpoints protegidos.
- Los permisos se controlan por rol desde el backend.
- El frontend permanece desacoplado, utilizando únicamente el token JWT para autenticarse frente a la API.


## 📜 Licencia
Este proyecto se distribuye bajo la licencia MIT.  
Consulta el archivo `LICENSE` para más detalles.
