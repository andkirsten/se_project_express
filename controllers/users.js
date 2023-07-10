const User = require("../models/user");
const {
  VALIDATION_ERROR_CODE,
  CAST_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/errors");

exports.getUsers = function (req, res) {
  User.find({})
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log("Get Users " + err.name);
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};

exports.createUser = function (req, res) {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};

exports.getUserById = function (req, res) {
  const userId = req.params.userId;
  if (!mongoose.ObjectId.isValid(userId)) {
    User.findById(userId)
      // .orFail(() => {
      //   const error = new Error("User ID not found");
      //   error.status = 404;
      //   throw error;
      // })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        if (err.name === "CastError")
          return res.status(CAST_ERROR_CODE).json({ message: err.message });
      });
  }
};
