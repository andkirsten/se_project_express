const express = require("express");
const auth = require("../middlewares/auth");
const clothingItemsController = require("../controllers/clothingItems");

const router = express.Router();

router.get("/", clothingItemsController.getItems);
router.post("/", auth, clothingItemsController.createClothingItem);
router.delete("/:itemId", auth, clothingItemsController.deleteClothingItem);
router.put("/:itemId/likes", auth, clothingItemsController.likeClothingItem);
router.delete(
  "/:itemId/likes",
  auth,
  clothingItemsController.unlikeClothingItem,
);

module.exports = router;
