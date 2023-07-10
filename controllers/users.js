const User = require("../models/user");

exports.getUsers = function (req, res, next) {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch(next);
};

exports.createUser = function (req, res, next) {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).json(user);
      console.log(user);
    })
    .catch(next);
};

exports.getUserById = function (req, res, next) {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User ID not found");
      error.status = 404;
      throw error;
    })
    .then((user) => {
      res.json(user);
    })
    .catch(next);
};
