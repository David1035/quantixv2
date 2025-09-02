const { config } = require('../config/config')

const USER = encodeURIComponent(config.dbUser);
const PASSWORD = encodeURIComponent(config.dbPassword);

const URL = `postgres://${USER}:${PASSWORD}@${config.dbHost}:${config.dbPort}/${config.dbName}`


module.exports = {
  development: {
    url: URL,
    dialect: 'postgres',
  },
  production: {
    url: URL,
    dialect: 'postgres',
  }
}


const { Sequelize } = require('sequelize');

// const path = require('path');

// module.exports = {
//   development: {
//     dialect: 'sqlite',
//     storage: path.join(__dirname, '../db/database.sqlite') // o donde quieras guardar tu .sqlite
//   },
//   test: {
//     dialect: 'sqlite',
//     storage: ':memory:'
//   },
//   production: {
//     dialect: 'sqlite',
//     storage: path.join(__dirname, '../db/database.sqlite')
//   }
// };
