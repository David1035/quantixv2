const express = require('express');
const ProfileService = require('./../services/profile.service');
const validatorHandler = require('./../middlewares/validation.handler');
const { checkARoles } = require('./../middlewares/auth.handler');
const { createProfileSchema, updateProfileSchema, getProfileSchema } = require('./../schemas/profile.schema');
const passport = require('passport');


const router = express.Router();
const service = new ProfileService();



router.post('/',
  //passport.authenticate('jwt', { session: false }),
  //checkARoles('administrador', 'admin'),
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
