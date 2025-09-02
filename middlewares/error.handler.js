const boom = require('@hapi/boom');

function logErrors (err, req, res, next) {
  console.error(err);
  next();
};

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




module.exports = { logErrors, boomErrorHandler, errorHandler };
