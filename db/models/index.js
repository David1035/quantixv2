const { UserModel, User } = require('./user.model');
const { ProfileModel, Profile } = require('./profile.model');
const { CustomerModel, Customer } = require('./customer.model');
const { CreditModel, Credit } = require('./credit.model');
const { CreditPaymentsModel, CreditPayments } = require('./credit-payments.model');
const { CategoryModel, Category } = require('./../models/category.model');
const { ProductModel, Product } = require('./../models/product.model');
//const {} = require('');

function setupModel (sequelize) {
  User.init(UserModel, User.config(sequelize));
  Profile.init(ProfileModel, Profile.config(sequelize));
  Customer.init(CustomerModel, Customer.config(sequelize));
  Credit.init(CreditModel, Credit.config(sequelize));
  CreditPayments.init(CreditPaymentsModel, CreditPayments.config(sequelize));
  Category.init(CategoryModel, Category.config(sequelize));
  Product.init(ProductModel, Product.config(sequelize));

  Profile.associate(sequelize.models);
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Credit.associate(sequelize.models);
  CreditPayments.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);



}

module.exports = setupModel;
