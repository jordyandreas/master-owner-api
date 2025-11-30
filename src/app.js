const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const ownersRouter = require("./routes/owners");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "Owners API (lowdb)" });
});

app.use("/owners", ownersRouter);

app.use(errorHandler);

module.exports = app;
