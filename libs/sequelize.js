require('dotenv').config() //cargar variables de entorno al inicio

const { Sequelize } = require('sequelize');
const setupModel = require('./../db/models')
const { config } = require('../config/config')

// Codificar usuario y contraseña para URLs seguras
const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

// Construir URL de conexión PostgreSQL
const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

//debug
console.log('DB Config:', config);
console.log('URL de conexión:', URL);

const sequelize = new Sequelize (URL, {
  dialect: 'postgres',
  logging: true
})


setupModel(sequelize);

// Verificar conexión y manejar errores
sequelize.authenticate()
  .then(() => console.log('Conexión a la base de datos establecida correctamente.'))
  .catch(err => console.error('Error al conectar con la base de datos:', err));

module.exports = sequelize;

// const path = require('path');

// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: path.join(__dirname, '../database.sqlite'),
//   logging: false
// });

// // Habilitar foreign_keys después de la conexión
// sequelize.authenticate().then(() => {
//   return sequelize.query('PRAGMA foreign_keys = ON;');
// }).then(() => {
//   console.log('Foreign keys enabled');
// }).catch(err => {
//   console.error('Unable to enable foreign keys:', err);
// });

// module.exports = sequelize;
