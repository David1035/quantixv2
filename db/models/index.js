const { UserModel, User } = require('./user.model');
const { ProfileModel, Profile } = require('./profile.model');
const { CustomerModel, Customer } = require('./customer.model');
const { CreditModel, Credit } = require('./credit.model');
const { CreditPaymentsModel, CreditPayments } = require('./credit-payments.model');
const { CategoryModel, Category } = require('./../models/category.model');
const { ProductModel, Product } = require('./../models/product.model');
const { ProductSupplierModel, ProductSupplier } = require('./product-supplier.model');
const { SupplierModel, Supplier} = require('./supplier.model');
const { SaleModel, Sale } = require('./sale.model');
const { InvoiceModel, Invoice } = require('./invoice.model');
const { DetailSaleModel, DetailSale } = require('./detail-sale.model');
//const {} = require('');

function setupModel (sequelize) {
  User.init(UserModel, User.config(sequelize));
  Profile.init(ProfileModel, Profile.config(sequelize));
  Customer.init(CustomerModel, Customer.config(sequelize));
  Credit.init(CreditModel, Credit.config(sequelize));
  CreditPayments.init(CreditPaymentsModel, CreditPayments.config(sequelize));
  Category.init(CategoryModel, Category.config(sequelize));
  Product.init(ProductModel, Product.config(sequelize));
  Supplier.init(SupplierModel, Supplier.config(sequelize));
  ProductSupplier.init(ProductSupplierModel, ProductSupplier.config(sequelize));
  Sale.init(SaleModel, Sale.config(sequelize));
  Invoice.init(InvoiceModel, Invoice.config(sequelize));
  DetailSale.init(DetailSaleModel, DetailSale.config(sequelize));


  Profile.associate(sequelize.models);
  User.associate(sequelize.models);
  Customer.associate(sequelize.models);
  Credit.associate(sequelize.models);
  CreditPayments.associate(sequelize.models);
  Category.associate(sequelize.models);
  Product.associate(sequelize.models);
  Supplier.associate(sequelize.models);
  ProductSupplier.associate(sequelize.models);
  Sale.associate(sequelize.models);
  Invoice.associate(sequelize.models);
  DetailSale.associate(sequelize.models);
  }

module.exports = setupModel;
