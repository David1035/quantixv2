const { models } = require('./../libs/sequelize')

class UserService {
  constructor(){

  }

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async find() {
    const data = await models.User.findAll();
    return data;
  }

  async findOne(id) {
    return []
  }

  async update(id, changes) {

  }
  async delete(id) {

  }
}

module.exports = UserService;
