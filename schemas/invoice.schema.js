const Joi = require('joi');

const id = Joi.number().integer();
const fecha = Joi.date();
const montoTotal = Joi.number().precision(2).positive();
const isActive = Joi.boolean();

const createInvoiceSchemas = Joi.object({
  fecha: fecha,
  montoTotal: montoTotal.required(),
  isActive: isActive
})

const updateInvoiceSchemas = Joi.object({
  fecha: fecha,
  montoTotal: montoTotal,
  isActive: isActive
})

const getInvoiceSchemas = Joi.object({
  id: id.required()
})

module.exports = { createInvoiceSchemas, updateInvoiceSchemas, getInvoiceSchemas }
