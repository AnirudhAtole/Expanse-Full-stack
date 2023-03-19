const express = require('express');

const router = express.Router();

const userController = require('../controller/User');

router.post('/add-User', userController.addUser);

module.exports = router;