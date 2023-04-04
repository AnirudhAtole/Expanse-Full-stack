const express = require('express');
const passwordController = require('../controller/password');
const router = express.Router();

router.post('/password/forgotpassword' , passwordController.forgotPassword)

module.exports = router;