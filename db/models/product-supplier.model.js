const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./product.model');
const { SUPPLIER_TABLE } = require('./supplier.model');

const PRODUCT_SUPPLIER_TABLE = 'product_supplier';

const ProductSupplierModel = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
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
  supplierId: {
    field: 'supplier_id',
    allowNull: true,
    type: DataTypes.INTEGER,
    references: {
      model: SUPPLIER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }

}

class ProductSupplier extends Model {
  static associate(models){
    // relaciones
    this.belongsTo(models.Supplier, {as: 'supplier', foreignKey: 'supplierId'});
    this.belongsTo(models.Product, {as: 'product', foreignKey: 'productId'})
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: PRODUCT_SUPPLIER_TABLE,
      modelName: 'ProductSupplier',
      timestamps: false
    }
  }
}


module.exports = { PRODUCT_SUPPLIER_TABLE, ProductSupplierModel, ProductSupplier }
