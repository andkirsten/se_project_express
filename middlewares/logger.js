const requestLogger = (req, res, next) => {
  console.log(`Request ${req.method} ${req.originalUrl}`);
  next();
};

const errorLogger = (err, req, res, next) => {
  console.error(err.stack);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
  next();
};

module.exports = { requestLogger, errorLogger };
