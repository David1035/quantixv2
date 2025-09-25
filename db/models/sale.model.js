const { Model, DataTypes, Sequelize } = require('sequelize');

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
    type: DataTypes.STRING
  },
  total: {
    allowNull: false,
    type: DataTypes.DECIMAL(10,2)
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {

    }
  },
  usuarioId: {
    field: 'usuario_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {

    }
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
