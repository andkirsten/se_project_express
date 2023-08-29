const express = require("express");
const auth = require("../middlewares/auth");
const clothingItemsController = require("../controllers/clothingItems");
const {
  validateCreateClothingItem,
  validateClothingItemId,
} = require("../middlewares/validation");

const router = express.Router();

router.get("/", clothingItemsController.getItems);
router.post(
  "/",
  auth,
  validateCreateClothingItem,
  clothingItemsController.createClothingItem,
);
router.delete(
  "/:itemId",
  auth,
  validateClothingItemId,
  clothingItemsController.deleteClothingItem,
);
router.put(
  "/:itemId/likes",
  auth,
  validateClothingItemId,
  clothingItemsController.likeClothingItem,
);
router.delete(
  "/:itemId/likes",
  auth,
  validateClothingItemId,
  clothingItemsController.unlikeClothingItem,
);

module.exports = router;
