const express = require("express");

const router = express.Router();
const usersController = require("../controllers/users");

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);
router.get("/:userId", usersController.getUserById);

module.exports = router;
