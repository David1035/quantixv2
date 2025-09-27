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
    allowNull: false,
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
    allowNull: false,
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
