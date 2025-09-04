const express = require('express');


const userRouter = require('./user.router');
const profileRouter = require('./profile.router');




function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);

  router.use('/users', userRouter);
  router.use('/profile', profileRouter);
}


module.exports = routerApi;
