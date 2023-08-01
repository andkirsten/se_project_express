const express = require("express");
const {
  createUser,
  login,
  getUsers,
  getItems,
  getCurrentUser,
} = require("../controllers/users.js");
const authMiddleware = require("../middlewares/auth.js");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(authMiddleware);

router.get("/users", getUsers);
router.get("/users/:userId", getCurrentUser);

export default router;
