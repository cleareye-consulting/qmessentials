const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.select);
router.post('/', usersController.save);

module.exports = router;
