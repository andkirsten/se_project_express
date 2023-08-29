const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCreateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must be at most 30 characters long",
    }),
    weather: Joi.string().required().messages({
      "string.empty": "Weather is required",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Invalid URL",
    }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required",
      "string.uri": "Invalid URL",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email",
    }),
    password: Joi.string().required().min(8).messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
    }),
  }),
});

const validateClothingItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": "Item ID is required",
      "string.hex": "Invalid item ID",
      "string.length": "Item ID must be 24 characters long",
    }),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().messages({
      "string.empty": "Name is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required",
      "string.uri": "Invalid URL",
    }),
  }),
});

module.exports = {
  validateCreateClothingItem,
  validateUpdateUser,
  validateCreateUser,
  validateLogin,
  validateClothingItemId,
};
