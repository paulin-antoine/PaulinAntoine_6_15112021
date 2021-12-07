const express = require("express");
const mongoose = require("mongoose");
const AuthRoutes = require("./routes/auth");
const SaucesRoutes = require("./routes/sauces");
const Sauce = require("./models/sauce");
const path = require("path");
const app = express();
require("dotenv").config();
const helmet = require("helmet");

//Chemin vers la base de donnée MongoDB
mongoose
  .connect(process.env.MONGODB_SRV, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.json());
app.use(helmet());
app.use("/api/auth", AuthRoutes);
app.use("/api/sauces", SaucesRoutes);

module.exports = app;
