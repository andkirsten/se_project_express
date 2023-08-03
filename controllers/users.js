const User = require("../models/user");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

const {
  VALIDATION_ERROR_CODE,
  AUTHENTICATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
  ASSERTION_ERROR_CODE,
} = require("../utils/errors");

exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) =>
      res.status(SERVER_ERROR_CODE).json({ message: err.message }),
    );
};

exports.createUser = (req, res) => {
  console.log("createUser");
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => res.send({ name, avatar, email, _id: user._id }))
    .catch((err) => {
      console.log(err);
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.name === "MongoError" && err.code === 11000)
        return res
          .status(VALIDATION_ERROR_CODE)
          .json({ message: "This email already exists" });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

//   User.findOne({ email }).then((user) => {
//     if (user) {
//       return res
//         .status(ASSERTION_ERROR_CODE)
//         .json({ message: "This email already exists" });
//     }
//     bcrypt.hash(password, 10).then((hash) => {
//       User.create({ name, avatar, email, password: hash })
//         .then((user) => res.status(201).json(user))
//         .then((user) => {
//           console.log(user);
//         })
//         .catch((err) => {
//           console.log(err);
//           if (err.name === "ValidationError")
//             return res
//               .status(VALIDATION_ERROR_CODE)
//               .json({ message: err.message });
//           if (err.name === "MongoError" && err.code === 11000)
//             return res
//               .status(VALIDATION_ERROR_CODE)
//               .json({ message: "This email already exists" });
//           return res
//             .status(SERVER_ERROR_CODE)
//             .json({ message: "Internal Server Error" });
//         });
//     });
//   });
// };

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
      if (err.name === "DocumentNotFoundError")
        return res
          .status(AUTHENTICATION_ERROR_CODE)
          .json({ message: err.message });
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "CastError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.updateUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (password) {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Internal Server Error" });
      }
      updateWithHashedPassword(hash);
    });
  } else {
    updateWithHashedPassword(null);
  }

  function updateWithHashedPassword(hashedPassword) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, avatar, email, password: hashedPassword },
      { new: true },
    )
      .orFail()
      .then((user) => res.json(user))
      .catch((err) => {
        if (err.name === "ValidationError")
          return res
            .status(VALIDATION_ERROR_CODE)
            .json({ message: err.message });
        if (err.name === "DocumentNotFoundError")
          return res
            .status(NOT_FOUND_ERROR_CODE)
            .json({ message: err.message });
        if (err.name === "MongoError" && err.code === 11000)
          return res
            .status(VALIDATION_ERROR_CODE)
            .json({ message: "This email already exists" });
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Internal Server Error" });
      });
  }
};
