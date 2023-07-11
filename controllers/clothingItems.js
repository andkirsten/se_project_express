const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");

const {
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} = require("../utils/errors");

exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.json(items);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
    });
};

exports.createClothingItem = (req, res) => {
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

exports.deleteClothingItem = (req, res) => {
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
      if (err.name === "CastError")
        return res.status(VALIDATION_ERROR_CODE).json({ message: err.message });
      if (err.name === "DocumentNotFoundError")
        return res.status(NOT_FOUND_ERROR_CODE).json({ message: err.message });
      if (err.name === "Error")
        return res.status(NOT_FOUND_ERROR_CODE).json({ message: err.message });
    });
};

exports.likeClothingItem = (req, res) => {
  const itemId = req.params.itemId;
  if (!mongoose.isValidObjectId(itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This item doesn't exist" });
  }

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      if (err.name === "CastError")
        return res
          .status(VALIDATION_ERROR_CODE)
          .json({ message: "validation error" });
      if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "document not found" });
    });
};

exports.unlikeClothingItem = (req, res) => {
  const itemId = req.params.itemId;
  if (!mongoose.isValidObjectId(itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This item doesn't exist" });
  }
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((item) => {
      res.json(item);
    })
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(VALIDATION_ERROR_CODE)
          .json({ message: "validation error" });
      if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .json({ message: "document not found" });
    });
};
