const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

/**
 * Dashboard Analytics Routes
 */
router.get('/', statsController.getStats);

module.exports = router;
