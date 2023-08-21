const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { errorLogger } = require("../middlewares/logger");

const { VALIDATION_ERROR_CODE } = require("../utils/errors");

exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send({ name, avatar, email, _id: user._id }))
    .catch((err) => {
      errorLogger(err);
    });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      errorLogger(err);
    });
};

exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      errorLogger(err);
    });
};

exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .json({ message: "Name and avatar are required" });
  }
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      errorLogger(err);
    });
  return null;
};
