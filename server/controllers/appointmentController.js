const Appointment = require('../models/Appointment');
const User = require('../models/User');
const StressAssessment = require('../models/StressAssessment');

// @desc    Get list of verified counselors
// @route   GET /api/appointments/counselors
// @access  Public or Private
exports.getCounselors = async (req, res, next) => {
  try {
    const counselors = await User.find({
      role: 'counselor',
      isVerified: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      count: counselors.length,
      data: counselors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Book a new appointment
// @route   POST /api/appointments
// @access  Private (User)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { counselorId, appointmentDate, timeSlot, reason } = req.body;

    if (!counselorId || !appointmentDate || !timeSlot || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide counselor, date, time slot, and reason for consultation',
      });
    }

    const counselor = await User.findById(counselorId);
    if (!counselor || counselor.role !== 'counselor') {
      return res.status(404).json({
        success: false,
        message: 'Selected counselor not found or invalid',
      });
    }

    // Check user's latest stress assessment
    const latestAssessment = await StressAssessment.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    const appointment = await Appointment.create({
      user: req.user.id,
      counselor: counselorId,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      reason,
      stressLevelAtBooking: latestAssessment ? latestAssessment.stressLevel : 'Not Assessed',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully! Awaiting counselor confirmation.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get appointments for currently logged in user
// @route   GET /api/appointments/my-appointments
// @access  Private
exports.getMyAppointments = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'user') {
      query.user = req.user.id;
    } else if (req.user.role === 'counselor') {
      query.counselor = req.user.id;
    } else if (req.user.role === 'admin') {
      // admin can view all
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone age occupation')
      .populate('counselor', 'name email specialization qualifications rating avatar')
      .sort({ appointmentDate: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update appointment status (Counselor accepts, rejects, or adds notes)
// @route   PUT /api/appointments/:id/status
// @access  Private (Counselor or Admin)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, counselorNotes, counselorAdvice, cancellationReason, meetingLink } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    // Role check: Only the assigned counselor or admin can update status
    if (
      req.user.role !== 'admin' &&
      appointment.counselor.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You are not authorized to update this appointment',
      });
    }

    if (status) appointment.status = status;
    if (counselorNotes !== undefined) appointment.counselorNotes = counselorNotes;
    if (counselorAdvice !== undefined) appointment.counselorAdvice = counselorAdvice;
    if (cancellationReason !== undefined) appointment.cancellationReason = cancellationReason;
    if (meetingLink !== undefined) appointment.meetingLink = meetingLink;

    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: `Appointment updated to '${appointment.status}'`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel appointment (User)
// @route   PUT /api/appointments/:id/cancel
// @access  Private (User or Counselor)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (
      appointment.user.toString() !== req.user.id &&
      appointment.counselor.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'Cancelled by participant';
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment cancelled',
    });
  } catch (error) {
    next(error);
  }
};
