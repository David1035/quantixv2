const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class SaleService {
  constructor(){}

  async create(body){
    const data = await models.Sale.create(body);
    return data;
  }

  async find(){
    const data = await models.Sale.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.Sale.findByPk(id);
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

  async detele(id){
    const data = await this.findOne(id);
    await data.destroy();
    return { id, status: 'eliminado' }
  }
}

module.exports = SaleService;
