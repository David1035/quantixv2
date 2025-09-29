const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class DetailSaleService {
  constructor(){}

  async create(data){
    const data = await models.DetailSale.create(data);
    return data;
  }

  async find(){
    const data = await models.DetailSale.findAll();
    return data;
  }

  async findOne(id){
    const data = await models.DetailSale.findByPk(id);
    if(!data){
      throw new boom.notFound('Venta no encontrada');
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
    data.destroy();
    return { id, status: 'eliminado' }
  }
}

module.exports = DetailSaleService;
