const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");

const {
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const clothingItem = require("../models/clothingItem");

exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.json(items))
    .catch((err) => {
      next(new NotFoundError("This item doesn't exist"));
    });
};

exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      next(new BadRequestError("Invalid data"));
      next(new ConflictError("This item already exists"));
      next(new NotFoundError("This item doesn't exist"));
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
          next(new ForbiddenError("You are not allowed to delete this item")),
        );
      }
      return clothingItem
        .deleteOne({ _id: itemId })
        .then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch((err) => {
      next(new NotFoundError("This item doesn't exist"));
      next(new BadRequestError("Invalid data"));
      next(new ConflictError("This item already exists"));
      next(new ForbiddenError("You are not allowed to delete this item"));
      next(new UnauthorizedError("You are not authorized"));
    });
};
exports.likeClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  if (!mongoose.isValidObjectId(itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This item doesn't exist" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      next(new NotFoundError("This item doesn't exist"));
      next(new ConflictError("This item already exists"));
      next(new BadRequestError("Invalid data"));
    });
};

exports.unlikeClothingItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;
  if (!mongoose.isValidObjectId(itemId)) {
    return res
      .status(VALIDATION_ERROR_CODE)
      .send({ message: "This item doesn't exist" });
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail()
    .then((item) => res.json(item))
    .catch((err) => {
      next(new NotFoundError("This item doesn't exist"));
      next(new ConflictError("This item already exists"));
      next(new BadRequestError("Invalid data"));
    });
};
