const Joi = require('joi');

const id = Joi.number().integer();
const creditId = Joi.number().integer();
const paymentsAmount = Joi.number().min(3).positive().precision(2);

const createSchemaCreditPayments = Joi.object({
  creditId: creditId.required(),
  paymentsAmount: paymentsAmount.required(),
});

const updateSchemaCreditPayments = Joi.object({
  creditId,
  paymentsAmount,
});

const getCreditPaymentsSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createSchemaCreditPayments,
  updateSchemaCreditPayments,
  getCreditPaymentsSchema,
};
