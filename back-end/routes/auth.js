const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const auth = require('../middleware/auth');
const authCtrls = require('../controllers/auth');


router.post('/signup', authCtrls.signup);
router.post('/login', authCtrls.login);


module.exports = router;