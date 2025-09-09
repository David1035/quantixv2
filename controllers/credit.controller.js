const express = require('express');
const boom = require('@hapi/boom');
const validatorHandler = require('./../schemas/credit.schema');
const { createSchemaCredit, updateSchemaCredit } = require('./../schemas/credit.schema');
const CreditService = require('./../services/credit.service');

const router = express.Router();
const service = new CreditService();



