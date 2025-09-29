const express = require('express');
const DetailSaleService = require('./../services/detail-sale.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createDetailSaleSchema, updateDetailSaleSchema, getDetailSaleSchema } = require('./../schemas/detail-sale.schema');

const service = new DetailSaleService();
const router = express.Router();

router.post('/',
  validatorHandler(createDetailSaleSchema, 'body'),
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
  validatorHandler(getDetailSaleSchema, 'params'),
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
  validatorHandler(getDetailSaleSchema, 'params'),
  validatorHandler(updateDetailSaleSchema, 'body'),
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
  validatorHandler(getDetailSaleSchema, 'params'),
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

