const express = require('express');
const Sauce = require('../models/sauce');
const fs = require('fs');
const router = express.Router();
const sauceInstance = new Sauce ({
      sauce:"hot-sauce",
      image: fs.readFileSync('text.txt')
    });

router.get('/:id',(req,res,next) =>{
    Sauce.findOne({_id: req.params.id})
    .then(res.status(200).json(sauceInstance))
    .catch((error) => res.status(400).json({message:"erreur : "+ error}))
  });
  router.get('/',(req,res,next) =>{
    Sauce.find()
    .then(res.status(200).json([sauceInstance]))
    .catch((error) => res.status(400).json({message:"erreur: "+ error}))
  });

  module.exports = router;