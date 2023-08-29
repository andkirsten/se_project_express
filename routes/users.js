const express = require("express");
const { updateUser, getCurrentUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/me", auth, getCurrentUser);

router.patch("/me", auth, validateUpdateUser, updateUser);

module.exports = router;
