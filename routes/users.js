const express = require("express");
const router = express.Router();
const { updateUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, updateUser);

module.exports = router;
