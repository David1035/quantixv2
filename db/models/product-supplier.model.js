const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model');
const { SUPPLIER_TABLE } = require('./supplier.model');

const PRODUCT_SUPPLIER_TABLE = 'product_supplier';

const productSupplierModel = {
  id: {
    autoIncrement: false,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  idProduct: {
    field: 'id_product',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  idProveedor: {
    field: 'id_supplier',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: SUPPLIER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  createdAt: {
    field: 'create_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }

}

class ProductSupplier extends Model {
  static associate(){
    // relaciones
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: PRODUCT_SUPPLIER_TABLE,
      modelName: 'ProductSupllier',
      timestamps: false
    }
  }
}


module.exports = { PRODUCT_SUPPLIER_TABLE, productSupplierModel }
