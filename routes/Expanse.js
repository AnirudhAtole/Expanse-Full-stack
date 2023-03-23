const express = require('express');

const router = express.Router();

const expanseController = require('../controller/Expanse');
const Authenticate = require('../authenticate/auth')

router.get('/expanses' , Authenticate.authenticate, expanseController.getExpanses );
router.post('/del-expanse/:id',expanseController.delExpanse);
router.post('/add-expanse',expanseController.addExpanse);

module.exports = router;