const express = require('express');
const CustomerService = require('./../services/customer.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createCustomerSchema, updateCustomerSchema, getCustomerSchema } = require('./../schemas/customer.schema');

const router = express.Router();
const service = new CustomerService();

router.post('/',
  validatorHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCustomer = await service.create(body);
      res.json(newCustomer);
    } catch (error) {
      next(error);
    }
  }
);



module.exports = router;
