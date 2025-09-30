const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class CustomerService {
  constructor(){}

  async create(data) {
    const newCustomer = await models.Customer.create(data);
    return newCustomer;
  }

  async find() {
    const data = await models.Customer.findAll();
    return data;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id, {
      include: ['credit'] // incluir la relación de credito
    });
    if(!customer) {
      throw boom.notFound('Client not found for id');
    }
    return customer;
  }

  async update(id, changes) {
    const customer = await this.findOne(id);
    const rta = customer.update(changes);
    return rta;
  }

  async delete(id) {
    const customer = await this.findOne(id);
    await customer.destroy();
    return { id, message: 'el customer fue eliminado'}
  }
}

module.exports = CustomerService;
