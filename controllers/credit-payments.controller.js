// controllers/credit-payments.controller.js
const express = require('express');
const CreditPaymentsService = require('./../services/credit-payments.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createSchemaCreditPayments,
  updateSchemaCreditPayments,
  getCreditPaymentsSchema,
} = require('./../schemas/credit-payments.schema');

const router = express.Router();
const service = new CreditPaymentsService();

// Crear abono
router.post('/',
  validatorHandler(createSchemaCreditPayments, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newPayment = await service.create(body);
      res.status(201).json(newPayment);
    } catch (error) {
      next(error);
    }
  }
);

// Listar abonos
router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Detalle
router.get('/:id',
  validatorHandler(getCreditPaymentsSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const payment = await service.findOne(id);
      res.json(payment);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar
router.patch('/:id',
  validatorHandler(getCreditPaymentsSchema, 'params'),
  validatorHandler(updateSchemaCreditPayments, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updated = await service.update(id, changes);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar
router.delete('/:id',
  validatorHandler(getCreditPaymentsSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rta = await service.delete(id);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
