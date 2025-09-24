const { Model, DataTypes, Sequelize } = require('sequelize');

const SUPPLIER_TABLE = 'suppliers'

const SupplierModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  contacto: {
    allowNull: false,
    type: DataTypes.STRING
  },
  createdAt: {
    field: 'created_at',
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
}

class Supplier extends Model {
  static associate(models){
    this.belongsToMany(models.Product, {
      as: 'products',
      through: models.ProductSupplier,
      foreignKey: 'supplierId',
      otherKey: 'productId'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: SUPPLIER_TABLE,
      modelName: 'Supplier',
      timestamps: false
    }
  }
}

module.exports = { SUPPLIER_TABLE, Supplier, SupplierModel }
