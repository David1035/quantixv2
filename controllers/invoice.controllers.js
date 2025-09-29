const express = require('express');
const validadorHanlder = require('./../middlewares/validation.handler.js');
const { createInvoiceSchemas, updateInvoiceSchemas, getInvoiceSchemas } = require('./../schemas/invoice.schema');
const InvoiceService = require('./../services/invoice.service.js');

const service = new InvoiceService();
const router = express.Router();

router.post('/',
  validadorHanlder(createInvoiceSchemas, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newInvoice = await service.create(body);
      res.json(newInvoice);
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
  validadorHanlder(getInvoiceSchemas, 'params'),
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

router.post('/:id',
  validadorHanlder(getInvoiceSchemas, 'params'),
  validadorHanlder(updateInvoiceSchemas, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      req.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validadorHanlder(getInvoiceSchemas, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;
