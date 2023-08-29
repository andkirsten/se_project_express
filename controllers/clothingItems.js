const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../utils/errors/BadRequestError");
const ForbiddenError = require("../utils/errors/ForbiddenError");
const NotFoundError = require("../utils/errors/NotFoundError");
const ConflictError = require("../utils/errors/ConflictError");
const clothingItem = require("../models/clothingItem");

exports.getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.json(items))
    .catch(next);
};

exports.createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        next(new ConflictError("This item already exists"));
      }
      next(err);
    });
};

exports.deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return Promise.reject(
          next(new ForbiddenError("You are not allowed to delete this item")),
        );
      }
      return clothingItem
        .deleteOne({ _id: itemId })
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError("This item doesn't exist"));
      }
      next(err);
    });
};
exports.likeClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  if (!mongoose.isValidObjectId(itemId)) {
    next(new BadRequestError("Invalid data"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError("This item doesn't exist"));
      }
      if (err.code === 11000) {
        next(new ConflictError("This item already exists"));
      }
      next(err);
    });
};

exports.unlikeClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  if (!mongoose.isValidObjectId(itemId)) {
    next(new BadRequestError("Invalid data"));
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new NotFoundError("This item doesn't exist"));
      }
      next(err);
    });
};
