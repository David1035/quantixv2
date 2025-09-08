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
    allowNull: false,
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
    allowNull: false,
    field: 'total_amount',
    type: DataTypes.DECIMAL(10,2)
  },
  isActive: {
    allowNull: false,
    field: 'is_active',
    type: DataTypes.BOOLEAN,
    defaultValue: 'true'
  },
  createdAt: {
    allowNull: false,
    field: 'create_at',
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
