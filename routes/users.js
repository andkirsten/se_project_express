import express from "express";
import {
  createUser,
  login,
  getUsers,
  getItems,
  getUserById,
  getCurrentUser,
} from "../controllers/users.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems);

router.use(authMiddleware);

router.get("/users", getUsers);
router.get("/users/:userId", getCurrentUser);

export default router;
