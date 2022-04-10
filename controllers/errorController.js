const appError = require("../utils/appError")

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`
  return new appError(message, 400)
}

const handleDuplicateFields = err =>{
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/);
  const message = `Duplicate field value: ${value}. Please use another value!`;

  return new appError(message, 400)
}

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new appError(message, 400);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  //Operational error that we trust: send messaage to client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming error we don't trust, send a vague message to the client.
    console.log("Error!", err);
    res.status(500).json({
      status: "error",
      message: "SOmething went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {

    //we don't want to mutate our parameter with the handlecastErrorDB function, so we create a copy
    let error = { ...err };

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if(error.code === 11000) error = handleDuplicateFields(error);
    if(error.name === "ValidationError") error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};