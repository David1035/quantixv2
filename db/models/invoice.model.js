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
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  montoTotal: {
    field: 'monto_total',
    allowNull: false,
    type: DataTypes.DECIMAL(10,2)
  },
  saleId: {
    field: 'sale_id',
    allowNull: false,
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
