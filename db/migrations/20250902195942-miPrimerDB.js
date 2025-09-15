'use strict';

const { UserModel, USER_TABLE } = require('./../models/user.model');
const { ProfileModel, PROFILE_TABLE } = require('./../models/profile.model');
const { CustomerModel, CUSTOMER_TABLE } = require('./../models/customer.model');
const { CreditModel, CREDIT_TABLE } = require('./../models/credit.model');
const { CreditPaymentsModel, CREDIT_PAYMENTS_TABLE } = require('./../models/credit-payments.model');
const { CategoryModel, CATEGORY_TABLE } = require('./../models/category.model');
const { ProductModel, PRODUCT_TABLE } = require('./../models/product.model');
const { PRODUCT_PROVEEDOR_TABLE, productProveedorModel } = require('./../models/product-proveedor.model')


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(USER_TABLE, UserModel);
    await queryInterface.createTable(PROFILE_TABLE, ProfileModel);
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerModel);
    await queryInterface.createTable(CREDIT_TABLE, CreditModel);
    await queryInterface.createTable(CREDIT_PAYMENTS_TABLE, CreditPaymentsModel);
    await queryInterface.createTable(CATEGORY_TABLE, CategoryModel);
    await queryInterface.createTable(PRODUCT_TABLE, ProductModel);


  },

  async down (queryInterface) {
    await queryInterface.dropTable(CREDIT_PAYMENTS_TABLE);
    await queryInterface.dropTable(CREDIT_TABLE);
    await queryInterface.dropTable(CUSTOMER_TABLE);
    await queryInterface.dropTable(PROFILE_TABLE);
    await queryInterface.dropTable(USER_TABLE);'use strict';

const { UserModel, USER_TABLE } = require('./../models/user.model');
const { ProfileModel, PROFILE_TABLE } = require('./../models/profile.model');
const { CustomerModel, CUSTOMER_TABLE } = require('./../models/customer.model');
const { CreditModel, CREDIT_TABLE } = require('./../models/credit.model');
const { CreditPaymentsModel, CREDIT_PAYMENTS_TABLE } = require('./../models/credit-payments.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.createTable(USER_TABLE, UserModel);
    await queryInterface.createTable(PROFILE_TABLE, ProfileModel);
    await queryInterface.createTable(CUSTOMER_TABLE, CustomerModel);
    await queryInterface.createTable(CREDIT_TABLE, CreditModel);
    await queryInterface.createTable(CREDIT_PAYMENTS_TABLE, CreditPaymentsModel);
  },

  async down (queryInterface) {
    await queryInterface.dropTable(CREDIT_PAYMENTS_TABLE);
    await queryInterface.dropTable(CREDIT_TABLE);
    await queryInterface.dropTable(CUSTOMER_TABLE);
    await queryInterface.dropTable(PROFILE_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(CATEGORY_TABLE);


  }
};



  }
};
