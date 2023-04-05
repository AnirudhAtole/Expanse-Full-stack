const express = require('express');
const passwordController = require('../controller/password');
const router = express.Router();

router.post('/password/forgotpassword', passwordController.forgotPassword)
router.get('/password/resetpassword/:uuid', passwordController.resetPassword)
router.post('/password/updatepassword/:uuid', passwordController.updatePassword)

module.exports = router;