const express = require('express');
const mongoose = require('mongoose');
const app = express();

mongoose.connect('mongodb+srv://piiquante:aynXtDLq7S7PZdbQ@cluster0.lhcza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
  app.use(express.json());
  app.post('/api/auth/signup',(req,res,next) => {
      console.log(req.body.email);
      console.log(req.body.password);
      res.status(201).json({message:"utilisateur ajouté"});
  });
  
  //mongodb+srv://piiquante:<password>@cluster0.lhcza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
module.exports = app ;