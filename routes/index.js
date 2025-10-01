const express = require('express');

const userController = require('./../controllers/user.controller');
const profileController = require('./../controllers/profile.controller');
const customerController = require('./../controllers/customer.controller');
const productController = require('./../controllers/product.controller');
const categoryController = require('./../controllers/category.controller');
const invoiceController = require('./../controllers/invoice.controllers');
const saleController = require('./../controllers/sale.controller');
const supplierController = require('./../controllers/supplier.controller');
const productSupplierController = require('./../controllers/product-supplier.controller');
const detailSaleController = require('./../controllers/detail-sale.controller');
const authController = require('./../controllers/auth.controller');




function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userController);
  router.use('/profiles', profileController);
  router.use('/customers', customerController);
  router.use('/products', productController);
  router.use('/categories', categoryController);
  router.use('/invoices', invoiceController);
  router.use('/sales', saleController);
  router.use('/suppliers', supplierController);
  router.use('/productSuppliers', productSupplierController);
  router.use('/detailSales', detailSaleController);
  router.use('/auth', authController);
}


module.exports = routerApi;
