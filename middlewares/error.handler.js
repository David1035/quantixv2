
const { ValidationError } = require('sequelize')
const boom = require('@hapi/boom');

function logErrors (err, req, res, next) {
  console.error(err);
  next(err);
};

function ormErrorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(409).json({ // 👈 return aquí
      statusCode: 409,
      message: err.name,
      errors: err.errors,
    });
  }
  next(err);
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
