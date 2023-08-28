const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const { VALIDATION_ERROR_CODE } = require("../utils/errors");

exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send({ name, avatar, email, _id: user._id }))
    .catch((err) => {
      next(new BadRequestError("Invalid data"));
      next(new ConflictError("This user already exists"));
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
      next(new UnauthorizedError("Incorrect email or password"));
      next(new BadRequestError("Invalid data"));
      next(new ConflictError("This user already exists"));
    });
};

exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      next(new NotFoundError("This user doesn't exist"));
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
      next(new NotFoundError("This user doesn't exist"));
      next(new BadRequestError("Invalid data"));
      next(new ConflictError("This user already exists"));
      next(new ForbiddenError("You are not allowed to update this user"));
      next(new UnauthorizedError("You are not authorized"));
    });
  return null;
};
