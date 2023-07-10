const ClothingItem = require("../models/clothingItem");

exports.getClothingItems = function (req, res, next) {
  ClothingItem.find({})
    .then((items) => {
      res.json(items);
    })
    .catch(next);
};

exports.createClothingItem = function (req, res, next) {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      res.status(201).json(item);
      console.log(item);
    })
    .catch(next);
};

exports.deleteClothingItem = function (req, res, next) {
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.status = 404;
      throw error;
    })
    .then((item) => {
      res.json(item);
    })
    .catch(next);
};

exports.likeClothingItem = function (req, res, next) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    console.log("like" + req.params.itemId),
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.status = 404;
      throw error;
    })
    .then((item) => {
      res.json(item);
    })
    .catch(next);
};

exports.unlikeClothingItem = function (req, res, next) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    console.log("unlike" + req.params.itemId),
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.status = 404;
      throw error;
    })
    .then((item) => {
      res.json(item);
    })
    .catch(next);
};
