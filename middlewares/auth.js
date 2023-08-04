const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config.js");
const { AUTHENTICATION_ERROR_CODE } = require("../utils/errors.js");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error("Auth Middleware: " + err);
    return res
      .status(AUTHENTICATION_ERROR_CODE)
      .json({ message: "Unauthorized: Invalid token" });
  }
  req.user = payload;
  return next();
};

module.exports = authMiddleware;
