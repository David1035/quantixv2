const { UserModel, User } = require('./user.model');

function setupModel (sequelize) {
  User.init(UserModel, User.config(sequelize))


  
}

module.exports = setupModel;
