'use strict';

const { UserModel, USER_TABLE } = require('./../models/user.model');
const { ProfileModel, PROFILE_TABLE } = require('./../models/profile.model');
const { CustomerModel, CUSTOMER_TABLE } = require('./../models/customer.model');
const { CreditModel, CREDIT_TABLE } = require('./../models/credit.model');
const { CreditPaymentsModel, CREDIT_PAYMENTS_TABLE } = require('./../models/credit-payments.model');
const { CategoryModel, CATEGORY_TABLE } = require('./../models/category.model');
const { ProductModel, PRODUCT_TABLE } = require('./../models/product.model');
const { ProductSupplierModel, PRODUCT_SUPPLIER_TABLE } = require('./../models/product-supplier.model');
const { SupplierModel, SUPPLIER_TABLE } = require('./../models/supplier.model');
const { SaleModel, SALE_TABLE } = require('./../models/sale.model');
const { DetailSaleModel, DETAIL_SALE_TABLE } = require('./../models/detail-sale.model');
const { InvoiceModel, INVOICE_TABLE } = require('./../models/invoice.model');


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
    await queryInterface.createTable(SUPPLIER_TABLE, SupplierModel);
    await queryInterface.createTable(PRODUCT_SUPPLIER_TABLE, ProductSupplierModel);
    await queryInterface.createTable(SALE_TABLE, SaleModel);
    await queryInterface.createTable(DETAIL_SALE_TABLE, DetailSaleModel);
    await queryInterface.createTable(INVOICE_TABLE, InvoiceModel);
  },

  async down (queryInterface) {
    // Tablas que dependen de otras (deben eliminarse primero)
    await queryInterface.dropTable(DETAIL_SALE_TABLE);
    await queryInterface.dropTable(INVOICE_TABLE);
    await queryInterface.dropTable(SALE_TABLE);
    await queryInterface.dropTable(PRODUCT_SUPPLIER_TABLE);
    await queryInterface.dropTable(CREDIT_PAYMENTS_TABLE);
    // Dependencias intermedias
    await queryInterface.dropTable(CREDIT_TABLE);
    await queryInterface.dropTable(PRODUCT_TABLE);
    await queryInterface.dropTable(CATEGORY_TABLE);
    await queryInterface.dropTable(SUPPLIER_TABLE);
    await queryInterface.dropTable(CUSTOMER_TABLE);
    await queryInterface.dropTable(PROFILE_TABLE);
    await queryInterface.dropTable(USER_TABLE);
    }
};
