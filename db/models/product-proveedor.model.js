const { Model, DataTypes, Sequelize } = require('sequelize');
const { PRODUCT_TABLE } = require('./../models/product.model');

const PRODUCT_PROVEEDOR_TABLE = 'product_proveedor';

const productProveedorModel = {
  id: {
    autoIncrement: false,
    primaryKey: true,
    allowNull: false,
    type: DataTypes.INTEGER
  },
  fkIdProduct: {
    field: 'fk_id_product',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: PRODUCT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  fkIdProveedor: {
    field: 'fk_id_proveedor',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: ,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  }

}


module.exports = { PRODUCT_PROVEEDOR_TABLE, productProveedorModel }
