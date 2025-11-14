const { models } = require('./../libs/sequelize');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');


class ProfileService {
  constructor(){

  }

  async create(body){
    const hash = await bcrypt.hash(body.user.password, 10);
    const newData = {
      ...body,
      user: {
        ...body.user,
        password: hash
      }
    }
    const newProfile = await models.Profile.create(newData,{
      include: ['user']
    });

    const plainProfile = newProfile.toJSON();
    if(plainProfile.user){
      delete plainProfile.user.password;
    }

    return plainProfile;
  }

  async find() {
    const data = await models.Profile.findAll({
      include: [{
        //incluir una relación, pero omitir el password, seguro y fácil de aplicar
        association: 'user',
        attributes: { exclude: ['password'] }
      }]
    });

    return data;
  }

  async findOne(id) {
    const profile = await models.Profile.findByPk(id, {
      include: ['user']
    });
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
    await profile.destroy();
    return {id, message: 'Perfil eliminado'}
  }
}


module.exports = ProfileService;



