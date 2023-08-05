const requestLogger = (req, res, next) => {
  console.log(`Request ${req.method} ${req.originalUrl}`);
  next();
};

const errorLogger = (err, req, res, next) => {
  console.error(err);
  next(err);
};

module.exports = { requestLogger, errorLogger };
