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
    allowNull: false,
    type: DataTypes.STRING
  },
  salePrice: {
    allowNull: false,
    field: 'sale_price',
    type: DataTypes.DECIMAL(10, 2)
  },
  stock: {
    allowNull: false,
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
    allowNull: false,
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
