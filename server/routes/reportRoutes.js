const express = require('express');
const router = express.Router();
const { getMyProgressReport } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/my-progress', protect, getMyProgressReport);

module.exports = router;
