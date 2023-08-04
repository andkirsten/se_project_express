const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.json(items))
    .catch(
      (err) =>
        console.error("Get Items: " + err) ||
        res.status(SERVER_ERROR_CODE).json({ message: err.message }),
    );
};

exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      console.error("Create Item: " + err);
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      return res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Internal Server Error" });
    });
};

exports.deleteClothingItem = (req, res) => {
  const { itemId } = req.params;
  if (!itemId) {
    throw new Error("This item doesn't exist");
  }
  if (req.user._id !== clothingItem.owner) {
    console.log(req.user._id);
    console.log(clothingItem.owner);
    throw new Error("You are not allowed to delete this item");
  }
  ClothingItem.findByIdAndDelete(itemId)
    .then((item) => res.json(item))
    .catch((err) => {
      console.error("Delete Item: " + err);
      if (err.message === "This item doesn't exist")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.message === "You are not allowed to delete this item")
        return res.status(403).json({ message: err.message });
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
      console.error("Like Item: " + err);
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
      console.error("Unlike Item: " + err);
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
