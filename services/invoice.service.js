const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class InvoiceService {
  constructor(){}

  async create(data){
    const newInvoice = await models.Invoice.create(data);
    return newInvoice;
  }

  async find(){
    const data = await models.Invoice.findAll();
    return data;
  }

  async findOne(id){
    const oneInvoice = await models.Invoice.findByPk(id);
    if(!oneInvoice){
      throw  boom.notFound('Factura no encontrada')
    }
    return oneInvoice;
  }

  async update(id, changes){
    const data = await this.findOne(id);
    const update = await data.update(changes);
    return update;
  }

  async delete(id){
    const data = await this.findOne(id);
    await data.destroy();
    return { id }
  }
}

module.exports = InvoiceService;
