const { Sequelize } = require('sequelize');
const path = require('path');
//const setupModel = require('./../db/models')
// const { config } = require('../config/config')

// const USER = encodeURIComponent(config.dbUser);
// const PASSWORD = encodeURIComponent(config.dbPassword);

// const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`

// const sequelize = new Sequelize (URL, {
//   dialect: 'postgres',
//   logging: true
// })


// setupModel(sequelize);

//module.exports = sequelize;

const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: false
});

// Habilitar foreign_keys después de la conexión
sequelize.authenticate().then(() => {
  return sequelize.query('PRAGMA foreign_keys = ON;');
}).then(() => {
  console.log('Foreign keys enabled');
}).catch(err => {
  console.error('Unable to enable foreign keys:', err);
});

module.exports = sequelize;
