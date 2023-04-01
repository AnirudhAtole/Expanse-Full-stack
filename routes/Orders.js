const express = require('express');
const PurchaseController = require('../controller/Order');

const Authenticate = require('../authenticate/auth');

const router = express.Router();

router.get('/premiumMembership' , Authenticate.authenticate , PurchaseController.purchasePremium);
router.post('/updateTransaction' , Authenticate.authenticate , PurchaseController.updateTransaction);


module.exports = router;