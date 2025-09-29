const express = require('express');
const SupplierService = require('./../services/supplier.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createSupplierSchema, updateSupplierSchema, getSupplierSchema } = require('./../schemas/supplier.schema');

const service = new SupplierService();
const router = express.Router();

router.post('/',
  validatorHandler(createSupplierSchema, 'body'),
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
  validatorHandler(getSupplierSchema, 'params'),
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
  validatorHandler(getSupplierSchema, 'params'),
  validatorHandler(updateSupplierSchema, 'body'),
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
  validatorHandler(getSupplierSchema, 'params'),
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
