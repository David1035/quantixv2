const Joi = require('joi');

const id = Joi.number().positive();
const fecha = Joi.date();
const total = Joi.number().precision(2).positive();
const customerId = Joi.number().positive();
const userId = Joi.number().positive();

const createSaleSchema = Joi.object({
  fecha: fecha,
  total: total.required(),
  customerId: customerId.required(),
  userId: userId.required()
})

const updateSaleSchema = Joi.object({
  fecha: fecha,
  total: total,
  customerId: customerId,
  userId: userId
})

const getSaleSchemna = Joi.object({
  id: id.required()
})

module.exports = { createSaleSchema, updateSaleSchema, getSaleSchemna };
