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
