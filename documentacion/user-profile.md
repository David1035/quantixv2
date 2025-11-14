const { Model, DataTypes, Sequelize } = require('sequelize');

const USER_TABLE = 'users';

const UserModel = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER
  },
  email: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING
  },
  role: {
    allowNull: true,
    type: DataTypes.STRING,
    defaultValue: 'vendedor'
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  }
}


class User extends Model {
  static associate(models){
    this.hasOne(models.Profile, {
      as: 'profile',
      foreignKey: 'userId'
    })

    this.hasMany(models.Sale, {
      as: 'sales',
      foreignKey: 'userId'
    })
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}

module.exports = { USER_TABLE, UserModel, User }



const express = require('express');
const UserService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createUserSchema, updateUserSchema, getUserShema } = require('./../schemas/user.schema');

const router = express.Router();
const service = new UserService();

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  async (req, res, next) => {
    try {
      const users = await service.find();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  validatorHandler(getUserShema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  validatorHandler(getUserShema, 'params'),
  validatorHandler(updateUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedUser = await service.update(id, body);
      res.json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  validatorHandler(getUserShema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const rta = await service.delete(id);
      res.json(rta);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;

const Joi = require('joi');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string();

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role: role
});

const updateUserSchema = Joi.object({
  email: email,
  password: password,
  role: role
});

const getUserShema = Joi.object({
  id: id.required()
});

module.exports = { createUserSchema, updateUserSchema, getUserShema };

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

// perfil -- aquí la información de profile

const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const PROFILE_TABLE = 'profiles';

const ProfileModel = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  name: {
    allowNull: true,
    type: DataTypes.STRING
  },
  lastName: {
    allowNull: true,
    type: DataTypes.STRING,
    field: 'last_name'
  },
  document: {
    allowNull: true,
    unique: true,
    type: DataTypes.INTEGER
  },
  phone: {
    allowNull: true,
    type: DataTypes.STRING
  },
  createdAt: {
    field: 'created_at',
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  userId: {
    unique: true,
    allowNull: true,
    field: 'user_id',
    type: DataTypes.INTEGER,
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}

class Profile extends Model {
  static associate(models){
    this.belongsTo(models.User, {as: 'user'})
  }

  static config(sequelize){
    return {
      sequelize,
      tableName: PROFILE_TABLE,
      modelName: 'Profile',
      timestamps: false
    }
  }
}

module.exports = { PROFILE_TABLE, Profile, ProfileModel}

const express = require('express');
const ProfileService = require('./../services/profile.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { checkARoles } = require('./../middlewares/auth.handler');
const { createProfileSchema, updateProfileSchema, getProfileSchema } = require('./../schemas/profile.schema');
const passport = require('passport');


const router = express.Router();
const service = new ProfileService();



router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  validatorHandler(createProfileSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProfile = await service.create(body);
      res.json(newProfile);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('admin', 'administrador'),
  validatorHandler(getProfileSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  validatorHandler(getProfileSchema, 'params'),
  validatorHandler(updateProfileSchema, 'body'),
  async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const data = await service.findOne(id, body);
        res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;


// este se llama profile-ruta-controller.js no entiendo por qué?

const express = require('express');
const ProfileService = require('./../services/profile.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { checkARoles } = require('./../middlewares/auth.handler');
const { createProfileSchema, updateProfileSchema, getProfileSchema } = require('./../schemas/profile.schema');
const passport = require('passport');


const router = express.Router();
const service = new ProfileService();



router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  validatorHandler(createProfileSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newProfile = await service.create(body);
      res.json(newProfile);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('admin', 'administrador'),
  validatorHandler(getProfileSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.findOne(id);
      res.json(data)
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  validatorHandler(getProfileSchema, 'params'),
  validatorHandler(updateProfileSchema, 'body'),
  async (req, res, next) => {
    try {
        const { id } = req.params;
        const body = req.body;
        const data = await service.findOne(id, body);
        res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkARoles('administrador', 'admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;


const Joi = require('joi');
const {createUserSchema, updateUserSchema } = require('./user.schema')

const id = Joi.number().integer();
const name = Joi.string();
const lastName = Joi.string();
const document = Joi.number().min(5);
const phone = Joi.string().min(10);
const userId = Joi.number().integer();

const createProfileSchema = Joi.object({
  name: name.required(),
  lastName: lastName.required(),
  document: document.required(),
  phone: phone.required(),
  user: createUserSchema
});

const updateProfileSchema = Joi.object({
  name: name,
  lastName: lastName,
  document: document,
  phone: phone,
  userId: userId,
  user: updateUserSchema
});

const getProfileSchema = Joi.object({
  id: id.required()
});

module.exports = { createProfileSchema, updateProfileSchema, getProfileSchema }

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



// aquí tienes las rutas 

const express = require('express');

const userController = require('./../controllers/user.controller');
const profileController = require('./../controllers/profile.controller');
const customerController = require('./../controllers/customer.controller');
const productController = require('./../controllers/product.controller');
const categoryController = require('./../controllers/category.controller');
const invoiceController = require('./../controllers/invoice.controllers');
const saleController = require('./../controllers/sale.controller');
const supplierController = require('./../controllers/supplier.controller');
const productSupplierController = require('./../controllers/product-supplier.controller');
const detailSaleController = require('./../controllers/detail-sale.controller');
const authController = require('./../controllers/auth.controller');




function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userController);
  router.use('/profiles', profileController);
  router.use('/customers', customerController);
  router.use('/products', productController);
  router.use('/categories', categoryController);
  router.use('/invoices', invoiceController);
  router.use('/sales', saleController);
  router.use('/suppliers', supplierController);
  router.use('/productSuppliers', productSupplierController);
  router.use('/detailSales', detailSaleController);
  router.use('/auth', authController);
}


module.exports = routerApi;



//Registro de login y autenticacion 
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { config } = require('./../config/config');

const router = express.Router();

router.post('/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const payload = {
        sub: user.id,
        role: user.role,
      }
      const token = jwt.sign(payload, config.jwtSecret)
      res.json({
        user,
        token
      });
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;

const { Strategy, ExtractJwt } = require('passport-jwt');

const { config } = require('./../../../config/config');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
}

const JwtStrategy = new Strategy(options, (payload, done) => {
  return done(null, payload);
});

module.exports = JwtStrategy;

const { Strategy } = require('passport-local');
const bcrypt = require('bcrypt');
const UserService = require('./../../../services/user.service');
const boom = require('@hapi/boom');

const service = new UserService();

const LocalStrategy = new Strategy({
  //cambiar el nombre de por defecto a los campos.
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
    try {
      const user = await service.findByEmail(email);
      if(!user){
        done(boom.unauthorized(), false);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch){
        done(boom.unauthorized(), false);
      }

      delete user.dataValues.password;

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
)

module.exports = LocalStrategy;

const passport = require('passport');

const LocalStrategy = require('./strategy/local.strategy');
const JwtStrategy = require('./strategy/jwt.strategy');
// aquí se declaran las estrategias, si voy a inicar con wts

passport.use(LocalStrategy);
passport.use(JwtStrategy);


