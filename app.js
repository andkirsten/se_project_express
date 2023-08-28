const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { login, createUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errorHandler } = require("./middlewares/errors");
const { errors } = require("celebrate");

const app = express();
const { PORT = 3001 } = process.env;

app.use(helmet());
app.use(requestLogger);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());
app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);

app.post("/signin", login);
app.post("/signup", createUser);

app.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .json({ message: "Requested resource not found" });
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
