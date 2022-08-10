require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const { client } = require("./db");
// Setup your Middleware and API Router here
app.use(cors("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("<__Body Logger START__>");
  console.log(req.body);
  console.log("<__Body Logger END__>");

  next();
});

const router = require("./api");
app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.send({ error: err.name, message: err.message, name: err.name });
});
module.exports = app;
