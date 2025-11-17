const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class SupplierService {
  constructor(){}

  async create(body){
    const data = await models.Supplier.create(body);
    return data;
  }

  async find(){
    const data = await models.Supplier.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.Supplier.findByPk(id);
    if(!data){
      throw  boom.notFound('Venta no encontrada');
    }

    return data;
  }

  async update(id, changes){
    const data = await this.findOne(id);
    const rta = await data.update(changes);
    return rta;
  }

  async delete(id){
    const data = await this.findOne(id);
    await data.destroy();
    return { id, status: 'eliminado' }
  }
}

module.exports = SupplierService;
