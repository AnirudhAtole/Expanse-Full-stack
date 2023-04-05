const express = require('express');
const passwordController = require('../controller/password');
const router = express.Router();
const EmailAuth = require('../authenticate/emailAuth');

router.post('/password/forgotpassword', EmailAuth.emailAuth , passwordController.forgotPassword)
router.post('/password/resetpassword/:uuid', passwordController.resetPassword)
router.post('/password/updatepassword/:uuid', passwordController.updatePassword)

module.exports = router;