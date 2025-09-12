'use strict';

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


  }
};
