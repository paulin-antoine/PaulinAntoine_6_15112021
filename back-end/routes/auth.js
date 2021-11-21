const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/signup',(req,res,next) => {
    const userInstance = new User ({
      email:(req.body.email),
      password:(req.body.password)
    });
    userInstance.save()
    .then(() => res.status(201).json({message:"utilisateur ajouté"}))
    .catch((error) => res.status(400).json({message:"erreur: "+ error}))
    
});
router.post('/login',(req,res,next) => {
  User.findOne({email: req.body.email, password: req.body.password})
  .then((user) => res.status(200).json({userId: user._id, token: user._id}))//Remplacer token: user._id par web token json
  .catch((error) => res.status(401).json({message:"erreur "+ error}));
});


module.exports = router;