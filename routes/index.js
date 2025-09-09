const express = require('express');


const userController = require('./../controllers/user.controller');
const profileController = require('./../controllers/profile.controller');
const customerController = require('./../controllers/customer.controller');




function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userController);
  router.use('/profile', profileController);
  router.use('/customers', customerController);
}


module.exports = routerApi;
