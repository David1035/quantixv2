### Customer 

# Controller-Customer
const express = require('express');
const CustomerService = require('./../services/customer.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomerSchema
} = require('./../schemas/customer.schema');

const router = express.Router();
const service = new CustomerService();

router.post('/',
  validatorHandler(createCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCustomer = await service.create(body);
      res.status(201).json(newCustomer);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  async (req, res, next) => {
    try {
      const customers = await service.find();
      res.json(customers);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const customer = await service.findOne(id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer no encontrado' });
      }
      res.json(customer);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  validatorHandler(updateCustomerSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCustomer = await service.update(id, body);
      res.json(updatedCustomer);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getCustomerSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rta = await service.delete(id);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

# Models -customer

const { Model, DataTypes, Sequelize } = require('sequelize');
const CUSTOMER_TABLE = 'customers';

const CustomerModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING
  },
  lastName: {
    allowNull: true,
    type: DataTypes.STRING
  },
  document: {
    allowNull: true,
    unique: true,
    type: DataTypes.INTEGER
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING
  },
  estadoCredito: {
    allowNull: true,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'estado_credito'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}


class Customer extends Model {
  static associate(models){
    this.hasMany(models.Credit, {
      as: 'credit',
      foreignKey: 'customerId'
    });

    //Tiene muchas: un cliente tiene muchas ventas.
    this.hasMany(models.Sale, {
      as: 'sales',
      foreignKey: 'customerId'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CUSTOMER_TABLE,
      modelName: 'Customer',
      timestamps: false
    }
  }
}

module.exports = { CUSTOMER_TABLE, CustomerModel, Customer }

# Schema-Customer
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

# Service - Customer
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class CustomerService {
  constructor(){}

  async create(data) {
    const newCustomer = await models.Customer.create(data);
    return newCustomer;
  }

  async find() {
    const data = await models.Customer.findAll();
    return data;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id, {
      include: ['credit'] // incluir la relación de credito
    });
    if(!customer) {
      throw boom.notFound('Client not found for id');
    }
    return customer;
  }

  async update(id, changes) {
    const customer = await this.findOne(id);
    const rta = customer.update(changes);
    return rta;
  }

  async delete(id) {
    const customer = await this.findOne(id);
    await customer.destroy();
    return { id, message: 'el customer fue eliminado'}
  }
}

module.exports = CustomerService;

## Credit

# controllers - Credit 
const express = require('express');
const CreditService = require('./../services/credit.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createSchemaCredit,
  updateSchemaCredit,
  getCreditSchema
} = require('./../schemas/credit.schema');

const router = express.Router();
const service = new CreditService();

router.post('/',
  validatorHandler(createSchemaCredit, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCredit = await service.create(body);
      res.status(201).json(newCredit);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  async (req, res, next) => {
    try {
      const credits = await service.find();
      res.json(credits);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getCreditSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const credit = await service.findOne(id);
      if (!credit) {
        return res.status(404).json({ message: 'Crédito no encontrado' });
      }
      res.json(credit);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getCreditSchema, 'params'),
  validatorHandler(updateSchemaCredit, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedCredit = await service.update(id, body);
      res.json(updatedCredit);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getCreditSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rta = await service.delete(id);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;


# models- credit 
const { Model, DataTypes, Sequelize } = require('sequelize');
const { CUSTOMER_TABLE } = require('./customer.model');

const CREDIT_TABLE = 'credits';

const CreditModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  customerId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'customer_id',
    references: {
      model: CUSTOMER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  totalAmount: {
    allowNull: true,
    field: 'total_amount',
    type: DataTypes.DECIMAL(10,2)
  },
  isActive: {
    allowNull: true,
    field: 'is_active',
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  createdAt: {
    allowNull: false,
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}

class Credit extends Model {
  static associate(models){
    this.belongsTo(models.Customer, {as: 'customer'});

    this.hasMany(models.CreditPayments, {
      as: 'creditPayments',
      foreignKey: 'creditId'
    })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: CREDIT_TABLE,
      modelName: 'Credit',
      timestamps: false
    }
  }
}


module.exports = { CREDIT_TABLE, CreditModel, Credit };

# Schema - Credit 
const Joi = require('joi');

//const id = Joi.number().integer();
const customerId = Joi.number().integer();
const totalAmount = Joi.number().min(3).positive().precision(2);
const isActive = Joi.boolean();

const createSchemaCredit = Joi.object({
  customerId: customerId.required(),
  totalAmount: totalAmount.required(),
  isActive: isActive
})

const updateSchemaCredit = Joi.object({
  customerId: customerId,
  totalAmount: totalAmount,
  isActive: isActive
})


module.exports = { createSchemaCredit, updateSchemaCredit }

# Service - Credit 
const { models } = require('./../libs/sequelize');

class CreditService {
  constructor() {}

  async create(data) {
    const newCredit = await models.Credit.create(data);
    return newCredit;
  }

  async find() {
    const credits = await models.Credit.findAll();
    return credits;
  }

  async findOne(id) {
    const credit = await models.Credit.findByPk(id);
    if (!credit) {
      throw new Error('Crédito no encontrado');
    }
    return credit;
  }

  async update(id, changes) {
    const credit = await this.findOne(id);
    const updatedCredit = await credit.update(changes);
    return updatedCredit;
  }

  async delete(id) {
    const credit = await this.findOne(id);
    await credit.destroy();
    return { message: 'Crédito eliminado', id };
  }
}

module.exports = CreditService;

## abono

# controllers - ? revisar si esta o falta crearlo

# models - payments 
const { Model, DataTypes, Sequelize } = require('sequelize');
const { CREDIT_TABLE } = require('./credit.model');

const CREDIT_PAYMENTS_TABLE = 'credit_payments';

const CreditPaymentsModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  creditId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'credit_id',
    references: {
      model: CREDIT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  paymentsAmount: {
    allowNull: true,
    type: DataTypes.DECIMAL(10, 2),
    field: 'payments_amount',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

class CreditPayments extends Model {
  static associate(models) {
    this.belongsTo(models.Credit, {as: 'credit'})
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CREDIT_PAYMENTS_TABLE,
      modelName: 'CreditPayments',
      timestamps: false
    }
  }
}


module.exports = { CREDIT_PAYMENTS_TABLE, CreditPaymentsModel, CreditPayments }

# schema - payments
const Joi = require('joi');

//const id = Joi.number().integer();
const creditId = Joi.number().integer();
const paymentsAmount = Joi.number().min(3).positive().precision(2);


const createSchemaCreditPayments = Joi.object({
  creditId: creditId.required(),
  paymentsAmount: paymentsAmount.required(),
})

const updateSchemaCreditPayments = Joi.object({
  creditId: creditId,
  paymentsAmount: paymentsAmount
})


module.exports = { createSchemaCreditPayments, updateSchemaCreditPayments }

# service - payments 
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class CreditPaymentsService {
  constructor(){}

  async create(body){
    const data = await models.CreditPayments.create(body);
    return data;
  }

  async find(){
    const data = await models.CreditPayments.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.CreditPayments.findByPk(id);
    if(!data){
      throw new boom.notFound('Venta no encontrada');
    }

    return data;
  }

  async update(id, changes){
    const data = await this.findOne(id);
    const rta = await data.update(changes);
    return rta;
  }

  async detele(id){
    const data = await this.findOne(id);
    await data.destroy();
    return { id, status: 'eliminado' }
  }
}

module.exports = CreditPaymentsService;



