const Express = require('express');
const Authenticate = require('../authenticate/auth')
const router = Express.Router();
const downloadUrl = require('../models/downloadUrl')

router.get('/download/Alldownloads',Authenticate.authenticate , downloadUrl )

module.exports = router;