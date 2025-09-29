const express = require('express');


const userController = require('./../controllers/user.controller');
const profileController = require('./../controllers/profile.controller');
const customerController = require('./../controllers/customer.controller');
const productController = require('./../controllers/product.controller');
const categoryController = require('./../controllers/category.controller');
const invoiceController = require('./../controllers/invoice.controllers');




function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userController);
  router.use('/profile', profileController);
  router.use('/customers', customerController);
  router.use('/products', productController);
  router.use('/categories', categoryController);
  router.use('/invoice', invoiceController);
}


module.exports = routerApi;
