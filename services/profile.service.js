const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');

class ProfileService {
  constructor(){

  }

  async create(data){
    const newProfile = await models.Profile.create(data, {
      include: ['user']
    });
    return newProfile;
  }

  async find() {
    const data = await models.Profile.findAll({
      include: ['user']
    });
    return data;
  }

  async findOne(id) {
    const profile = await models.Profile.findByPk(id);
    if(!profile) {
      throw boom.notFound('profile not found')
    }
    return profile;
  }

  async update(id, changes) {
    const profile = await this.findOne(id);
    const rta = await profile.update(changes);
    return rta
  }

  async delete (id) {
    const profile = await this.findOne(id);
    profile.destroy();
    return {id, message: 'Perfil eliminado'}
  }
}


module.exports = ProfileService;
