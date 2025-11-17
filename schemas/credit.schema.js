// schemas/credit.schema.js
const Joi = require('joi');

const id = Joi.number().integer();
const customerId = Joi.number().integer();
const totalAmount = Joi.number().min(3).positive().precision(2);
const isActive = Joi.boolean();

const createSchemaCredit = Joi.object({
  customerId: customerId.required(),
  totalAmount: totalAmount.required(),
  isActive: isActive
});

const updateSchemaCredit = Joi.object({
  customerId,
  totalAmount,
  isActive
});

//  este 
const getCreditSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createSchemaCredit,
  updateSchemaCredit,
  getCreditSchema,
};
