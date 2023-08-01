const express = require("express");
const {
  createUser,
  login,
  getUsers,
  getCurrentUser,
} = require("../controllers/users.js");
const { getItems } = require("../controllers/clothingItems.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(authMiddleware);

router.get("/users", getUsers);
router.get("/users/:userId", getCurrentUser);

module.exports = router;
