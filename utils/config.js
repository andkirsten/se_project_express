const crypto = require("crypto");

const generateJWTSecret = () => {
  const byteLength = 32; // 256 bits
  return crypto.randomBytes(byteLength).toString("hex");
};

const JWT_SECRET = generateJWTSecret();

module.exports = { JWT_SECRET };
