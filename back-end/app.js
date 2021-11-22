const express = require('express');
const mongoose = require('mongoose');
const AuthRoutes = require('./routes/auth');
const SaucesRoutes = require('./routes/sauces');
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
  app.use('/api/auth', AuthRoutes);
  app.use('/api/sauces', SaucesRoutes);
  
  //mongodb+srv://piiquante:<password>@cluster0.lhcza.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
module.exports = app ;