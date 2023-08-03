const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const clothingItemsController = require("../controllers/clothingItems");

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
