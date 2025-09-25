const { Model, DataTypes, Sequelize } = require('sequelize');

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
    type: DataTypes.INTEGER,
    references: {

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
    //relación uno a uno con factura
  }

  static config(sequelize) {
    
  }
}
