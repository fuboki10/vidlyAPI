const express = require('express');
const router = express.Router();
const returnController = require('../controllers/return.controller');
const auth = require('../middleware/auth');

router.post('/', auth, returnController.returnRental);


module.exports = router;