const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const userController = require('../controllers/user.controller.js');

router.post('/', userController.createUser);

router.delete('/:id', [auth, admin], userController.deleteUser);

module.exports = router;