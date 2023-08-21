const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
  FORBIDDEN_ERROR_CODE,
} = require("../utils/errors");
const clothingItem = require("../models/clothingItem");
const { errorLogger } = require("../middlewares/logger");

exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.json(items))
    .catch((err) => {
      res.status(SERVER_ERROR_CODE).json({ message: err.message });
    });
};

exports.createClothingItem = (req, res) => {
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      errorLogger(err);
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "An error has occurred on the server" });
    });
};

exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return Promise.reject(
          new Error("You are not allowed to delete this item"),
        );
      }
      return clothingItem
        .deleteOne({ _id: itemId })
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      errorLogger(err);
      if (err.message === "This item doesn't exist")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.message === "You are not allowed to delete this item")
        return res.status(FORBIDDEN_ERROR_CODE).json({ message: err.message });
      if (err.name === "CastError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "Document Not Found" });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "An error has occurred on the server" });
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
      errorLogger(err);
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
        .json({ message: "An error has occurred on the server" });
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
      errorLogger(err);
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
