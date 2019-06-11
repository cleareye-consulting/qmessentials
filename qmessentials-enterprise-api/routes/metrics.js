const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metricsController');

router.get('/', metricsController.list);
router.post('/', metricsController.save);

module.exports = router;
