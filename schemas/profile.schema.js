const Joi = require('joi');
const {createUserSchema, updateUserSchema } = require('./user.schemas')

const id = Joi.number().integer();
const name = Joi.string();
const lastName = Joi.string();
const document = Joi.number().min(5);
const phone = Joi.string().min(10);
const userId = Joi.number().integer();

const createProfileSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  document: document.required(),
  phone: phone.required(),
  //userId: userId.required(),
  user: createUserSchema
});

const updateProfileSchema = Joi.object({
  name: name,
  lastName: lastName,
  document: document,
  phone: phone,
  userId: userId,
  user: createUserSchema
});

const getProfileSchema = Joi.object({
  id: id.required()
});

module.exports = { createProfileSchema, updateProfileSchema, getProfileSchema }
