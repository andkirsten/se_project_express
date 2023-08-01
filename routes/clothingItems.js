const express = require("express");

const router = express.Router();
const clothingItemsController = require("../controllers/clothingItems");

router.get("/", clothingItemsController.getItems);
router.post("/", clothingItemsController.createClothingItem);
router.delete("/:itemId", clothingItemsController.deleteClothingItem);
router.put("/:itemId/likes", clothingItemsController.likeClothingItem);
router.delete("/:itemId/likes", clothingItemsController.unlikeClothingItem);

module.exports = router;
