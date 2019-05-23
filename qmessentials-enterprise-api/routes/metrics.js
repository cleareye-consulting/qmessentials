const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.get('/', metricsController.list);

module.exports = router;
