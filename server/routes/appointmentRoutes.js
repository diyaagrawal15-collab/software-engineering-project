const express = require('express');
const router = express.Router();
const {
  getCounselors,
  bookAppointment,
  getMyAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/auth');

router.get('/counselors', getCounselors);
router.post('/', protect, bookAppointment);
router.get('/my-appointments', protect, getMyAppointments);
router.put('/:id/status', protect, updateAppointmentStatus);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router;
