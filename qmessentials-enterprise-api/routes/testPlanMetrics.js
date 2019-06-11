const express = require('express');
const router = express.Router();
const testPlanMetricsController = require('../controllers/testPlanMetricsController');

router.get('/', testPlanMetricsController.list);
router.post('/', testPlanMetricsController.save);

module.exports = router;
