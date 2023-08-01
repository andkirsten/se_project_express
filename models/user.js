const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [30, "Name must be at most 30 characters"],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: function validateURL(value) {
        return validator.isURL(value);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator: function validateEmail(value) {
        return validator.isEmail(value);
      },
    },
    message: (props) => `${props.value} is not a valid email`,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },
});

module.exports = mongoose.model("User", userSchema);
