const express = require('express');

const router = express.Router();

const expanseController = require('../controller/Expanse');
const Authenticate = require('../authenticate/auth')

router.get('/expanses' , Authenticate.authenticate, expanseController.getExpanses );
router.post('/del-expanse/:id',expanseController.delExpanse);
router.post('/add-expanse',Authenticate.authenticate,expanseController.addExpanse);
router.get('/download/getexpanses' , Authenticate.authenticate , expanseController.downloadExpanse);
router.get('/download/alldownloads' , Authenticate.authenticate , expanseController.getDownloadUrls);
router.get('/expanse/todaysExpanse' , Authenticate.authenticate , expanseController.getTodayExpanse);

module.exports = router;