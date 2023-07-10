const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users");

router.get("/", usersController.getUsers);
router.post("/", usersController.createUser);
router.get("/:userId", usersController.getUserById);

router.use(function (err, req, res, next) {
  res.status(err.status || 400).json({
    message: err.message,
  });
});

module.exports = router;
