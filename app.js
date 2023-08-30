const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const { errors } = require("celebrate");
const dotenv = require("dotenv");
const { login, createUser } = require("./controllers/users");
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./utils/errors/NotFoundError");
const { errorHandler } = require("./middlewares/errors");

const {
  validateCreateUser,
  validateLogin,
} = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;

dotenv.config();

app.use(helmet());
app.use(requestLogger);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  // eslint-disable-next-line no-console
  .then(() => console.log("Connected to MongoDB"))
  // eslint-disable-next-line no-console
  .catch((err) => console.log(err));

app.use(express.json());
app.use(cors());
app.use("/items", clothingItemsRouter);
app.use("/users", usersRouter);

app.post("/signin", validateLogin, login);
app.post("/signup", validateCreateUser, createUser);

app.use(() => {
  throw new NotFoundError("This page doesn't exist");
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
