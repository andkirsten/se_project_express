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
      validator: (value) => {
        return validator.isURL(value);
      },
      message: (props) => `${props.value} is not a valid URL`,
    },
  },
});

module.exports = mongoose.model("User", userSchema);
