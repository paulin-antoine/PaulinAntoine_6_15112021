const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailValidation = require("email-validator");
const authMiddleware = require("../middleware/auth.js");
require("dotenv").config();

exports.signup = (req, res, next) => {
  //Verification de la validité du format email.
  if (!emailValidation.validate(req.body.email)) {
    return res
      .status(403)
      .json({ message: "Le format email n'est pas valide !" });
  }
  if (req.body.password.length > 6) {
    //Hachage du mot de passe avant la requête.
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user
          .save()
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    return res
      .status(403)
      .json({
        message: "Le mot de passe doit contenir au minimum 6 caractères",
      });
  }
};

//Comparaison de l'email et du mot de passe haché avant la requête.
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error });
          } //authMiddleware.secretKey
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
