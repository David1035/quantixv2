const express = require('express');
const SaleService = require('./../services/sale.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createSaleSchema, updateSaleSchema, getSaleSchemna } = require('./../schemas/sale.schema');

const service = new SaleService();
const router = express.Router();

router.post('/',
  validatorHandler(createSaleSchema, 'body'),
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
  validatorHandler(getSaleSchemna, 'params'),
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
  validatorHandler(getSaleSchemna, 'params'),
  validatorHandler(updateSaleSchema, 'body'),
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
  validatorHandler(getSaleSchemna, 'params'),
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
