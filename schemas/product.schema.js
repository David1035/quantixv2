const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(2).max(255);
const salePrice = Joi.number().min(0);
const stock = Joi.number().integer().min(0).allow(null); // 👈 opcional y permite null
const categoryId = Joi.number().integer().min(1);

const createProductSchema = Joi.object({
  name: name.required(),
  salePrice: salePrice,
  categoryId: categoryId.required(),
  stock: stock.optional() // 👈 opcional al crear
});

const updateProductSchema = Joi.object({
  name,
  salePrice,
  categoryId,
  stock // 👈 opcional al actualizar
});

const getProductSchema = Joi.object({ id: id.required() });

module.exports = { createProductSchema, updateProductSchema, getProductSchema };

