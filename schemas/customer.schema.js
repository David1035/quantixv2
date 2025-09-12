const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string();
const lastName = Joi.string();
const document = Joi.number();
const phone = Joi.string();
const estadoCredito = Joi.boolean();

const createCustomerSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  document: document.required(),
  phone: phone.required(),
  estadoCredito: estadoCredito
})

const updateCustomerSchema = Joi.object({
  name: name,
  lastName: lastName,
  document: document,
  phone: phone,
  estadoCredito: estadoCredito
});

const getCustomerSchema = Joi.object({
  id: id.required()
})

module.exports = { createCustomerSchema, updateCustomerSchema, getCustomerSchema }
