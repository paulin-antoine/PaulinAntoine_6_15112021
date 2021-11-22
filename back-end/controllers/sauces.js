const Sauce = require('../models/sauce');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const fs = require('fs');

const sauceInstance = new Sauce ({
    sauce:"hot-sauce",
    image: fs.readFileSync('text.txt')
  });

exports.sauceId = ('/:id',auth,(req,res,next) =>{
    Sauce.findOne({_id: req.params.id})
    .then(res.status(200).json(sauceInstance))
    .catch((error) => res.status(400).json({message:"erreur : "+ error}))
  });

exports.getSauces = ('/',auth, (req,res,next) =>{
    Sauce.find()
    .then(res.status(200).json([sauceInstance]))
    .catch((error) => res.status(400).json({message:"erreur: "+ error}))
  });

exports.postSauces = ('/',auth, multer,(req,res,next) =>{
    console.log(req.body.sauce);
    res.status(201).json({message: "ok"})
  });