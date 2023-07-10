const express = require("express");

const router = express.Router();
const clothingItemsController = require("../controllers/clothingItems");

router.get("/", clothingItemsController.getClothingItems);
router.post("/", clothingItemsController.createClothingItem);
router.delete("/:itemId", clothingItemsController.deleteClothingItem);
router.put("/:itemId/likes", clothingItemsController.likeClothingItem);
router.delete("/:itemId/likes", clothingItemsController.unlikeClothingItem);

router.use((err, req, res) => {
  res.status(err.status || 400).json({
    message: err.message,
  });
});

module.exports = router;
