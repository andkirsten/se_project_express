const mongoose = require("mongoose");

const User = require("../models/user");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/errors");

exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.getUserById = (req, res) => {
  const { userId } = req.params;
  if (!mongoose.isValidObjectId(userId))
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This User doesn't exist" });
  else {
    User.findById(userId)
      .orFail()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        if (err.name === "DocumentNotFoundError")
          return res
            .status(NOT_FOUND_ERROR_CODE)
            .json({ message: err.message });
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Internal Server Error" });
      });
  }
};
