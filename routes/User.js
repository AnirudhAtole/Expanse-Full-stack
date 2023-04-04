const express = require('express');
const Authenticate = require('../authenticate/auth'); 

const router = express.Router();

const userController = require('../controller/User');

router.post('/add-User', userController.addUser);
router.post('/signIn',userController.checkSignIn);

module.exports = router;