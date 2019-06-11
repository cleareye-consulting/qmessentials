const express = require('express');
const router = express.Router();
const testPlansController = require('../controllers/testPlansController');

router.get('/', testPlansController.list);
router.post('/', testPlansController.save);

module.exports = router;
