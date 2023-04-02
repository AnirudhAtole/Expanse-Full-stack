const express = require('express');

const premiumController = require('../controller/premium');

const router = express.Router();

router.get('/premium/leaderBoard',premiumController.leaderBoard)

module.exports = router;