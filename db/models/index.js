const { UserModel, User } = require('./user.model');
const { ProfileModel, Profile } = require('./profile.model');
const { CustomerModel, Customer } = require('./customer.model');
const { CreditModel, Credit } = require('./credit.model');
const { CreditPaymentsModel, CreditPayments } = require('./credit-payments.model');
//const {} = require('');

function setupModel (sequelize) {
  User.init(UserModel, User.config(sequelize));
  Profile.init(ProfileModel, Profile.config(sequelize));
  Customer.init(CustomerModel, Customer.config(sequelize));
  Credit.init(CreditModel, Credit.config(sequelize));
  CreditPayments.init(CreditPaymentsModel, CreditPayments.config(sequelize));

  Profile.associate(sequelize.models);
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Credit.associate(sequelize.models);
  CreditPayments.associate(sequelize.models);



}

module.exports = setupModel;
