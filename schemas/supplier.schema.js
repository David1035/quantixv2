const Joi = require('joi');

const id = Joi.number().positive();
const name = Joi.string();
const contacto = Joi.string();

const createSupplierSchema = Joi.object({
  name: name.required(),
  contacto: contacto.required()
})

const updateSupplierSchema = Joi.object({
  name: name,
  contacto: contacto
});

const getSupplierSchema = Joi.object({
  id: id.required()
})

module.exports = { createSupplierSchema, updateSupplierSchema, getSupplierSchema };
