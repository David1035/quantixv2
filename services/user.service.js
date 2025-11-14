const { models } = require('./../libs/sequelize')
const bcrypt = require('bcrypt');

class UserService {
  constructor() {}

  async create(body) {
    const hash = await bcrypt.hash(body.password, 10);
    const newUser = await models.User.create({
      ...body,
      password: hash
    });
    //const newUser = await models.User.create(body)
    delete newUser.dataValues.password;
    return newUser;
  }

  async find() {
    const users = await models.User.findAll();
    return users;
  }

  async findByEmail(email) {
    const user = await models.User.findOne({
      where: { email }
    });
    return user;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: ['profile', 'sales'] // incluye las ventas y el perfil
    });
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

