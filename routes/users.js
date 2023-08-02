const express = require("express");
const router = express.Router();
const {
  getUsers,
  updateUser,
  getCurrentUser,
} = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

router.use(authMiddleware);

router.get("/", getUsers);

router.get("/users/me", getCurrentUser);

router.put("/:userId", updateUser);

module.exports = router;
