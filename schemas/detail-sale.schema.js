const Joi = require('joi');

const id = Joi.number().positive();
const saleId = Joi.number().positive();
const productId = Joi.number().positive();
const cantidad = Joi.number().positive();
const subtotal = Joi.number().precision(2).positive();

const createDetailSaleSchema = Joi.object({
  saleId: saleId.required(),
  productId: productId.required(),
  cantidad: cantidad.required(),
  subtotal: subtotal
})

const updateDetailSaleSchema = Joi.object({
  saleId: saleId,
  productId: productId,
  cantidad: cantidad,
  subtotal: subtotal
})


const getDetailSaleSchema = Joi.object({
  id: id.required()
})


module.exports = { createDetailSaleSchema, updateDetailSaleSchema, getDetailSaleSchema }
