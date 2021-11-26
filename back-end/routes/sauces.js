const express = require('express');
const router = express.Router();
const saucesCtrls = require('../controllers/sauces');
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');


  router.get('/:id',auth, saucesCtrls.sauceId);
  router.get('/',auth, saucesCtrls.getSauces);
  router.post('/',auth,multer, saucesCtrls.postSauces);
  router.put('/:id', auth, multer, saucesCtrls.modifySauce);
  router.delete('/:id', auth, saucesCtrls.deleteSauce);
  router.post('/:id/like', auth, saucesCtrls.likeSauce);
  
  module.exports = router;