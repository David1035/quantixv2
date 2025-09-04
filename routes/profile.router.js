const express = require('express');
const ProfileService = require('./../services/profile.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { createProfileSchema, updateProfileSchema, getProfileSchema } = require('./../schemas/profile.schema');

const router = express.Router();
const service = new ProfileService();



router.post('/',
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
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await service.delete(id);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
