const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(70);
const salePrice = Joi.number().precision(2).min(0);
const stock = Joi.number().integer().min(0);
const categoryId = Joi.number().integer().required();

const createProductSchema = Joi.object({
  name: name.required(),
  purchasePrice: purchasePrice.required(),
  salePrice: salePrice.required(),
  stock: stock.required(),
  categoryId: categoryId
});

const updateProductSchema = Joi.object({
  name,
  purchasePrice,
  salePrice,
  stock,
  categoryId
});

const getProductSchema = Joi.object({
  id: id.required()
});

module.exports = {
  createProductSchema,
  updateProductSchema,
  getProductSchema
};
