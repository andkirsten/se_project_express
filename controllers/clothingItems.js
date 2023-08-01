const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/errors");

exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.json(items))
    .catch((err) =>
      res.status(SERVER_ERROR_CODE).json({ message: err.message }),
    );
};

exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.deleteClothingItem = (req, res) => {
  if (req.user._id !== req.params.userId) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .json({ message: "You are not allowed to delete this item" });
  }
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail()
    .then((item) => res.json(item))
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

exports.likeClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.isValidObjectId(itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This item doesn't exist" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "CastError")
        return res
          .status(VALIDATION_ERROR_CODE)
          .json({ message: "validation error" });
      if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "document not found" });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.unlikeClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!mongoose.isValidObjectId(itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This item doesn't exist" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(VALIDATION_ERROR_CODE)
          .json({ message: "validation error" });
      if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "document not found" });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};
