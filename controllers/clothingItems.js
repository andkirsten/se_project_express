const { mongo } = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const {
  VALIDATION_ERROR_CODE,
  SERVER_ERROR_CODE,
  CAST_ERROR_CODE,
} = require("../utils/errors");

exports.getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};

exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).json(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};

exports.deleteClothingItem = (req, res, next) => {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.status = 404;
      throw error;
    })
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log("delete Item " + err.name);
      if (err.name === "CastError")
        return res.status(CAST_ERROR_CODE).json({ message: err.message });
    });
};

exports.likeClothingItem = (req, res, next) => {
  const itemId = req.params.itemId;
  if (!mongoose.ObjectId.isValid(itemId)) {
    const error = new Error("Item ID not found");
    error.status = 404;
    throw error;
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id.toString() } },
    { new: true },
  )
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log("like item " + err.name);
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};

exports.unlikeClothingItem = (req, res, next) => {
  const itemId = req.params.itemId;
  if (!mongoose.ObjectId.isValid(itemId)) {
    const error = new Error("Item ID not found");
    error.status = 404;
    throw error;
  }
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id.toString() } },
    { new: true },
  )
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      console.log("unlike " + err.name);
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};
