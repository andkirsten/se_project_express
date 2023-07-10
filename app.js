const express = require("express");
const mongoose = require("mongoose");
const app = express();
const { PORT = 3001 } = process.env;
const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItems");

app.use(express.json());

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

app.use((req, res, next) => {
  req.user = {
    _id: "64ab9f31c4e7777adb068f2f",
  };
  next();
});

app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);
