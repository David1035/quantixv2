const express = require('express');
const ProductSupplierService = require('./../services/product-supplier.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createProductSupplierSchema, updateProductSupplierSchema, getProductSupplierSchema } = require('./../schemas/product-supplier.schema');

const service = new ProductSupplierService();
const router = express.Router();

router.post('/',
  validatorHandler(createProductSupplierSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await service.create(body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/:id',
  validatorHandler(getProductSupplierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.patch('/:id',
  validatorHandler(getProductSupplierSchema, 'params'),
  validatorHandler(updateProductSupplierSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validatorHandler(getProductSupplierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.detele(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;
