## Supplier - controller
const express = require('express');
const SupplierService = require('./../services/supplier.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createSupplierSchema, updateSupplierSchema, getSupplierSchema } = require('./../schemas/supplier.schema');

const service = new SupplierService();
const router = express.Router();

router.post('/',
  validatorHandler(createSupplierSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await service.create(body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/:id',
  validatorHandler(getSupplierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.patch('/:id',
  validatorHandler(getSupplierSchema, 'params'),
  validatorHandler(updateSupplierSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validatorHandler(getSupplierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;

# supplier - models 
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

# schemas - supplier 

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


# Service - supplier 

const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class SupplierService {
  constructor(){}

  async create(body){
    const data = await models.Supplier.create(body);
    return data;
  }

  async find(){
    const data = await models.Supplier.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.Supplier.findByPk(id);
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

  async delete(id){
    const data = await this.findOne(id);
    await data.destroy();
    return { id, status: 'eliminado' }
  }
}

module.exports = SupplierService;

## product-supplier - controllers 
const express = require('express');
const ProductSupplierService = require('./../services/product-supplier.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createProductSupplierSchema, updateProductSupplierSchema, getProductSupplierSchema } = require('./../schemas/product-supplier.schema');

const service = new ProductSupplierService();
const router = express.Router();

router.post('/',
  validatorHandler(createProductSupplierSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await service.create(body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/:id',
  validatorHandler(getProductSupplierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.patch('/:id',
  validatorHandler(getProductSupplierSchema, 'params'),
  validatorHandler(updateProductSupplierSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validatorHandler(getProductSupplierSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.detele(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;

# product-supplier models 
const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model');
const { SUPPLIER_TABLE } = require('./supplier.model');

const PRODUCT_SUPPLIER_TABLE = 'product_supplier';

const ProductSupplierModel = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  productId: {
    field: 'product_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  supplierId: {
    field: 'supplier_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: SUPPLIER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }

}

class ProductSupplier extends Model {
  static associate(models){
    // relaciones
    this.belongsTo(models.Supplier, {as: 'supplier', foreignKey: 'supplierId'});
    this.belongsTo(models.Product, {as: 'product', foreignKey: 'productId'})
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: PRODUCT_SUPPLIER_TABLE,
      modelName: 'ProductSupplier',
      timestamps: false
    }
  }
}


module.exports = { PRODUCT_SUPPLIER_TABLE, ProductSupplierModel, ProductSupplier }

# schemas - product-supplier
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

# service - product-supplier 
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class ProductSupplierService {
  constructor(){}

  async create(body){
    const data = await models.ProductSupplier.create(body);
    return data;
  }

  async find(){
    const data = await models.ProductSupplier.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.ProductSupplier.findByPk(id);
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

module.exports = ProductSupplierService;

## invoice - controllers 

const express = require('express');
const validadorHanlder = require('./../middlewares/validation.handler.js');
const { createInvoiceSchemas, updateInvoiceSchemas, getInvoiceSchemas } = require('./../schemas/invoice.schema');
const InvoiceService = require('./../services/invoice.service.js');

const service = new InvoiceService();
const router = express.Router();

router.post('/',
  validadorHanlder(createInvoiceSchemas, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newInvoice = await service.create(body);
      res.json(newInvoice);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/:id',
  validadorHanlder(getInvoiceSchemas, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.post('/:id',
  validadorHanlder(getInvoiceSchemas, 'params'),
  validadorHanlder(updateInvoiceSchemas, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      req.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validadorHanlder(getInvoiceSchemas, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;

# models - invoice 

const { Model, DataTypes, Sequelize } = require('sequelize');

const { SALE_TABLE } = require('./sale.model');

const INVOICE_TABLE = 'invoices';

const InvoiceModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  fecha: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  montoTotal: {
    field: 'monto_total',
    allowNull: true,
    type: DataTypes.DECIMAL(10,2)
  },
  saleId: {
    field: 'sale_id',
    allowNull: true,
    unique: true,
    type: DataTypes.INTEGER,
    references: {
      model: SALE_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}

class Invoice extends Model {
  static associate(models) {
    //belongsTo -> pertenece a: La factura pertenece a una venta (FK en invoices)
    this.belongsTo(models.Sale, {
      as: 'sale',
      foreignKey: 'saleId'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: INVOICE_TABLE,
      modelName: 'Invoice',
      timestamps: false
    }
  }
}

module.exports = { INVOICE_TABLE, InvoiceModel, Invoice };

# schemas - invoice 
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

# service - invoice 
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class InvoiceService {
  constructor(){}

  async create(data){
    const newInvoice = await models.Invoice.create(data);
    return newInvoice;
  }

  async find(){
    const data = await models.Invoice.findAll();
    return data;
  }

  async findOne(id){
    const oneInvoice = await models.Invoice.findByPk(id);
    if(!oneInvoice){
      throw new boom.notFound('Factura no encontrada')
    }
    return oneInvoice;
  }

  async update(id, changes){
    const data = await this.findOne(id);
    const update = await data.update(changes);
    return update;
  }

  async delete(id){
    const data = await this.findOne(id);
    await data.destroy();
    return { id }
  }
}

module.exports = InvoiceService;

## sale-detail - controllers 
const express = require('express');
const DetailSaleService = require('./../services/detail-sale.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createDetailSaleSchema, updateDetailSaleSchema, getDetailSaleSchema } = require('./../schemas/detail-sale.schema');

const service = new DetailSaleService();
const router = express.Router();

router.post('/',
  validatorHandler(createDetailSaleSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await service.create(body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/:id',
  validatorHandler(getDetailSaleSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.patch('/:id',
  validatorHandler(getDetailSaleSchema, 'params'),
  validatorHandler(updateDetailSaleSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validatorHandler(getDetailSaleSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.detele(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;


# sale-detail models 
const { Model, DataTypes, Sequelize } = require('sequelize');

const { PRODUCT_TABLE } = require('./product.model');
const { SALE_TABLE } = require('./sale.model');

const DETAIL_SALE_TABLE = 'detail_sale';

const DetailSaleModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  saleId: {
    field: 'sale_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: SALE_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  productId: {
    field: 'product_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  cantidad: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  subtotal: {
    allowNull: true,
    type: DataTypes.DECIMAL(10,2)
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}

class DetailSale extends Model {
  static associate(models) {
    this.belongsTo(models.Sale, { as: 'sale', foreignKey: 'saleId' });
    this.belongsTo(models.Product, { as: 'product', foreignKey: 'productId' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: DETAIL_SALE_TABLE,
      modelName: 'DetailSale',
      timestamps: false
    }
  }
}

module.exports = { DETAIL_SALE_TABLE, DetailSaleModel, DetailSale };

# schema - sale-detail 
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

# service - sale-detail 
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class DetailSaleService {
  constructor(){}

  async create(body){
    const data = await models.DetailSale.create(body);
    return data;
  }

  async find(){
    const data = await models.DetailSale.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.DetailSale.findByPk(id);
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

module.exports = DetailSaleService;

## sale - controllers 
const express = require('express');
const SaleService = require('./../services/sale.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createSaleSchema, updateSaleSchema, getSaleSchemna } = require('./../schemas/sale.schema');

const service = new SaleService();
const router = express.Router();

router.post('/',
  validatorHandler(createSaleSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const data = await service.create(body);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.get('/:id',
  validatorHandler(getSaleSchemna, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

router.patch('/:id',
  validatorHandler(getSaleSchemna, 'params'),
  validatorHandler(updateSaleSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const data = await service.update(id, body);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
)

router.delete('/:id',
  validatorHandler(getSaleSchemna, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.detele(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
)

module.exports = router;

# models - sale 
const { Model, DataTypes, Sequelize } = require('sequelize');

const { CUSTOMER_TABLE } = require('./customer.model');
const { USER_TABLE } = require('./user.model');

const SALE_TABLE = 'sales';

const SaleModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  fecha: {
    allowNull: true,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  total: {
    allowNull: true,
    type: DataTypes.DECIMAL(10,2)
  },
  customerId: {
    field: 'customer_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  userId: {
    field: 'user_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}

class Sale extends Model {
  static associate(models) {
    // hasOne -> Tiene uno: Una venta tiene una factura (1:1). La FK está en invoices.sale_id
    this.hasOne(models.Invoice, {
      as: 'invoice',
      foreignKey: 'saleId'
      // onDelete/Update se controlan en el lado de Invoice (FK)
    });

    this.belongsTo(models.Customer, {
      as: 'customer',
      foreignKey: 'customerId'
    })

    this.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })

    this.belongsToMany(models.Product, {
      as: 'productos',
      through: models.DetailSale,
      foreignKey: 'saleId',
      otherKey: 'productId'
    })
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: SALE_TABLE,
      modelName: 'Sale',
      timestamps: false
    }
  }
}

module.exports = { SALE_TABLE, SaleModel, Sale }

# schema - sale 
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

# service - sale 
const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class SaleService {
  constructor(){}

  async create(body){
    const data = await models.Sale.create(body);
    return data;
  }

  async find(){
    const data = await models.Sale.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.Sale.findByPk(id);
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

module.exports = SaleService;




