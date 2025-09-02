
const { ValidationError } = require('sequelize')
const boom = require('@hapi/boom');

function logErrors (err, req, res, next) {
  console.error(err);
  next();
};

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(409).json({
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  } else {
    next(err); // si no es un ValidationError, pasa al siguiente handler
  }
}

function boomErrorHandler (err, req, res, next) {
  if(err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload)
  } else {
    next()
  }
}

function errorHandler(err, req, res, next) {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  })
};




module.exports = { logErrors, ormErrorHandler, boomErrorHandler, errorHandler };
