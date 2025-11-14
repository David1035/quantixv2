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
