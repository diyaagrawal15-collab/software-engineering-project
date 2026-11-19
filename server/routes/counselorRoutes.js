const express = require('express');
const router = express.Router();
const {
  getCounselorDashboard,
  getPatientDetails,
} = require('../controllers/counselorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('counselor', 'admin'), getCounselorDashboard);
router.get('/patient/:userId', protect, authorize('counselor', 'admin'), getPatientDetails);

module.exports = router;
