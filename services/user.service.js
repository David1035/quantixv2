const { models } = require('./../libs/sequelize')

class UserService {
  constructor() {}

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async find() {
    const users = await models.User.findAll();
    return users;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    return user;
  }

  async update(id, changes) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    const updatedUser = await user.update(changes);
    return updatedUser;
  }

  async delete(id) {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    await user.destroy();
    return { message: 'Usuario eliminado', id };
  }
}

module.exports = UserService;

