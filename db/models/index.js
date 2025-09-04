const { UserModel, User } = require('./user.model');
const { ProfileModel, Profile } = require('./profile.model');

function setupModel (sequelize) {
  User.init(UserModel, User.config(sequelize));
  Profile.init(ProfileModel, Profile.config(sequelize));

  Profile.associate(sequelize.models);
  User.associate(sequelize.models);



}

module.exports = setupModel;
