const { models } = require('./../libs/sequelize');

class CreditService {
  constructor() {}

  async create(data) {
    const newCredit = await models.Credit.create(data);
    return newCredit;
  }

  async find() {
    const credits = await models.Credit.findAll();
    return credits;
  }

  async findOne(id) {
    const credit = await models.Credit.findByPk(id);
    if (!credit) {
      throw new Error('Crédito no encontrado');
    }
    return credit;
  }

  async update(id, changes) {
    const credit = await this.findOne(id);
    const updatedCredit = await credit.update(changes);
    return updatedCredit;
  }

  async delete(id) {
    const credit = await this.findOne(id);
    await credit.destroy();
    return { message: 'Crédito eliminado', id };
  }
}

module.exports = CreditService;

