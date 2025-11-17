const express = require('express');
const CategoryService = require('./../services/category.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema
} = require('./../schemas/category.schema');

const router = express.Router();
const service = new CategoryService();

router.post('/',
  validatorHandler(createCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      res.json(newCategory);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getCategorySchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      res.json(category);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getCategorySchema, 'params'),
  validatorHandler(updateCategorySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updated = await service.update(id, changes);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getCategorySchema, 'params'),
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

// db/models/category.model.js
const { Model, DataTypes, Sequelize } = require('sequelize');

const CATEGORY_TABLE = 'categories';

const CategoryModel = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}

class Category extends Model {
  static associate(models) {
    this.hasMany(models.Product, {
      as: 'products',
      foreignKey: 'categoryId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CATEGORY_TABLE,
      modelName: 'Category',
      timestamps: false
    }
  }
}

module.exports = { CATEGORY_TABLE, CategoryModel, Category };

const Joi = require('joi');

const id = Joi.number().integer();
const name = Joi.string().min(3).max(50);
const description = Joi.string().max(255);

const createCategorySchema = Joi.object({
  name: name.required(),
  description: description
});

const updateCategorySchema = Joi.object({
  name: name,
  description: description
});

const getCategorySchema = Joi.object({
  id: id.required()
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  getCategorySchema
};

const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class CategoryService {
  constructor() {}

  async create(data) {
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async find() {
    const categories = await models.Category.findAll();
    return categories;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products'] // Relación definida en el modelo
    });
    if (!category) {
      throw boom.notFound('Category not found');
    }
    return category;
  }

  async update(id, changes) {
    const category = await this.findOne(id);
    const rta = await category.update(changes);
    return rta;
  }

  async delete(id) {
    const category = await this.findOne(id);
    await category.destroy();
    return { id, message: 'Categoría eliminada' };
  }
}

module.exports = CategoryService;

// product

// routes/products.route.js
const express = require('express');
const ProductService = require('./../services/product.service');
const validatorHandler = require('./../middlewares/validation.handler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema
} = require('./../schemas/product.schema');

const router = express.Router();
const service = new ProductService();

// Crear (201 + Location)
router.post('/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body; // { name, salePrice, categoryId, stock? }
      const newProduct = await service.create(body);
      // newProduct.id debe existir tras create
      res
        .status(201)
        .location(`/products/${newProduct.id}`)
        .json(newProduct);
    } catch (error) {
      next(error);
    }
  }
);

// Listar
router.get('/',
  async (req, res, next) => {
    try {
      // si luego quieres paginación: ?limit=&offset=
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

// Detalle
router.get('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await service.findOne(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// Actualizar total (PUT) – compatibilidad con front
router.put('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body; // puede incluir stock con número o null
      const updated = await service.update(id, changes);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Actualización parcial (PATCH) – mantén soporte
router.patch('/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const changes = req.body;
      const updated = await service.update(id, changes);
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }
);

// Eliminar (204 No Content)
router.delete('/:id',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      await service.delete(id);
      res.status(204).send(); // sin body
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

// db/models/product.model.js
const { Model, DataTypes, Sequelize } = require('sequelize');
const { CATEGORY_TABLE } = require('./category.model');

const PRODUCT_TABLE = 'products';

const ProductModel = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING
  },
  salePrice: {
    allowNull: true,
    field: 'sale_price',
    type: DataTypes.DECIMAL(10, 2)
  },
  stock: {
    allowNull: true,
    type: DataTypes.INTEGER
  },
  categoryId: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'category_id',
    references: {
      model: CATEGORY_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  },
  createdAt: {
    allowNull: true,
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}

class Product extends Model {
  static associate(models) {
    this.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'categoryId'
    });
    this.belongsToMany(models.Supplier, {
      as: 'suppliers',
      through: models.ProductSupplier,
      foreignKey: 'productId',
      otherKey: 'supplierId'
    });

    this.belongsToMany(models.Sale, {
      as: 'ventas',
      through: models.DetailSale,
      foreignKey: 'productId',
      otherKey: 'saleId'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: PRODUCT_TABLE,
      modelName: 'Product',
      timestamps: false
    }
  }
}

module.exports = { PRODUCT_TABLE, ProductModel, Product };

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

const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class ProductService {
  constructor() {}

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const products = await models.Product.findAll({
      include: 'category'
    });
    return products;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category']
    });
    if (!product) {
      throw boom.notFound('Product not found');
    }
    return product;
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    const rta = await product.update(changes);
    return rta;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id, message: 'Producto eliminado' };
  }
}

module.exports = ProductService;
