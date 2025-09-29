const Joi = require('joi');

const id = Joi.number().positive();
const productId = Joi.number().positive();
const supplierId = Joi.number().positive();

const createProductSupplierSchema = Joi.object({
  productId: productId.required(),
  supplierId: supplierId.required()
})

const updateProductSupplierSchema = Joi.object({
  productId: productId,
  supplierId: supplierId
})

const getProductSupplierSchema = Joi.object({
  id: id.required(),
})

module.exports = { createProductSupplierSchema, updateProductSupplierSchema, getProductSupplierSchema };
