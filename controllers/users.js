const User = require("../models/user");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../utils/config");
const jwt = require("jsonwebtoken");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  ASSERTION_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/errors");

exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.json(users))
    .catch((err) =>
      res.status(SERVER_ERROR_CODE).json({ message: err.message }),
    );
};

exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(ASSERTION_ERROR_CODE)
        .json({ message: "This email already exists" });
    }
  });
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    }
    User.create({ name, avatar, email, password: hash })
      .then((user) => res.status(201).json(user))
      .catch((err) => {
        if (err.name === "ValidationError")
          return res
            .status(VALIDATION_ERROR_CODE)
            .json({ message: err.message });
        if (err.name === "MongoError" && err.code === 11000)
          return res
            .status(VALIDATION_ERROR_CODE)
            .json({ message: "This email already exists" });
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Internal Server Error" });
      });
  });
};

// exports.getUserById = (req, res) => {
//   const { userId } = req.params;
//   if (!mongoose.isValidObjectId(userId)) {
//     return res
//       .status(VALIDATION_ERROR_CODE)
//       .json({ message: "This User doesn't exist" });
//   }
//   return User.findById(userId)
//     .orFail()
//     .then((user) => res.json(user))
//     .catch((err) => {
//       if (err.name === "DocumentNotFoundError")
//         return res.status(NOT_FOUND_ERROR_CODE).json({ message: err.message });
//       return res
//         .status(SERVER_ERROR_CODE)
//         .json({ message: "Internal Server Error" });
//     });
// };

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Incorrect email or password" });
      }
      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          return res.status(401).json({ message: "Internal Server Error" });
        }
        if (!isValid) {
          return res
            .status(ASSERTION_ERROR_CODE)
            .json({ message: "Incorrect email or password" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        return res.json({ token });
      });
    })
    .catch((err) =>
      res.status(SERVER_ERROR_CODE).json({ message: err.message }),
    );
};

exports.getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.json(user))
    .catch((err) => {
      console.log(err);
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
