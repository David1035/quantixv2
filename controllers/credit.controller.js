const express = require('express');
const CreditService = require('./../services/credit.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createSchemaCredit,
  updateSchemaCredit,
  getCreditSchema
} = require('./../schemas/credit.schema');

const router = express.Router();
const service = new CreditService();

router.post('/',
  validatorHandler(createSchemaCredit, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCredit = await service.create(body);
      res.status(201).json(newCredit);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  async (req, res, next) => {
    try {
      const credits = await service.find();
      res.json(credits);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getCreditSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const credit = await service.findOne(id);
      if (!credit) {
        return res.status(404).json({ message: 'Crédito no encontrado' });
      }
      res.json(credit);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getCreditSchema, 'params'),
  validatorHandler(updateSchemaCredit, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCredit = await service.update(id, body);
      res.json(updatedCredit);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getCreditSchema, 'params'),
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




