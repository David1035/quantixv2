const express = require('express');
const CustomerService = require('./../services/customer.service');
const validatorHandler = require('./../middlewares/validation.handler');
//const = require('./../schemas/')

const router = express.Router();
const service = new CustomerService();


