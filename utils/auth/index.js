const passport = require('passport');

const LocalStrategy = require('./strategy/local.strategy');
// aquí se declaran las estrategias, si voy a inicar con wts

passport.use(LocalStrategy);
