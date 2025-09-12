const express = require('express');
const UserService = require('./../services/user.service');
const validatorHandler = require('./../middlewares/validation.handler')
const { createUserSchema, updateUserSchema, getUserShema } = require('./../schemas/user.schema')


const service = new UserService();


const router = express.Router();

router.post('/',
  validatorHandler(createUserSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.json(newUser)
    } catch (error) {
      next(error);
    }
  }
)

router.get('/',
  async (req, res, next) => {
    try {
      const data = await service.find();
      res.json(data)
    } catch (error) {
      next()
    }
  }
);

router.get('/:id',
  validatorHandler(getUserShema, 'params'), // Cambiado 'id' por 'params'
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);



module.exports = router;
