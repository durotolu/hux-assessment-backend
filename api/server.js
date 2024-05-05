const express = require("express");

const authRouter = require("../users/auth-router");
const ContactsRouter = require("../contacts/contacts-router");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRouter);
app.use("/contacts", ContactsRouter);

app.get("/", (req, res) => {
  try {
    res.send({ revie: "Welcome to Contact Info!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;
