const express = require('express');
const UserService = require('./../services/user.service');
const { createUserSchema, updateUserSchema, getUserShema } = require('./../schemas/user.schemas')


const service = new UserService();


const router = express.Router();

router.post('/',
  async (req, res, next) => {
    // service.create(data)
    try {
      const body = req.body;
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
  async (req, res, next) => {
    try {

    } catch (error) {
      next(error)
    }
  }
)



module.exports = router;
