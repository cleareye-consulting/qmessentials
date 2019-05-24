const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController')

router.post('/', usersController.logIn);

module.exports = router;