const { Model, DataTypes, Sequelize } = require('sequelize');

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
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {

    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  userId: {
    field: 'user_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {

    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  cantidad: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  subtotal: {
    allowNull: false,
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
