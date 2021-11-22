const express = require('express');
const router = express.Router();
const saucesCtrls = require('../controllers/sauces');

  router.get('/:id', saucesCtrls.sauceId);
  router.get('/', saucesCtrls.getSauces);
  router.post('/', saucesCtrls.postSauces);
  
  module.exports = router;