const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { login, createUser, getCurrentUser } = require("./controllers/users");

const app = express();
const { PORT = 3001 } = process.env;
const usersRouter = require("./routes/users");

const clothingItemsRouter = require("./routes/clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");

app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.post("/signin", login);
app.post("/signup", createUser);

app.use((req, res, next) => {
  res.status(NOT_FOUND_ERROR_CODE).json({ message: "Not found" });
});

app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);
app.get("/users/me", getCurrentUser);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
