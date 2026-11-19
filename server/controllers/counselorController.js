const Appointment = require('../models/Appointment');
const User = require('../models/User');
const StressAssessment = require('../models/StressAssessment');
const MoodJournal = require('../models/MoodJournal');

// @desc    Get Counselor Dashboard Stats
// @route   GET /api/counselor/dashboard
// @access  Private (Counselor)
exports.getCounselorDashboard = async (req, res, next) => {
  try {
    const counselorId = req.user.id;

    const totalAppointments = await Appointment.countDocuments({ counselor: counselorId });
    const pendingRequests = await Appointment.countDocuments({ counselor: counselorId, status: 'pending' });
    const acceptedAppointments = await Appointment.countDocuments({ counselor: counselorId, status: 'accepted' });
    const completedAppointments = await Appointment.countDocuments({ counselor: counselorId, status: 'completed' });

    const upcomingAppointments = await Appointment.find({
      counselor: counselorId,
      status: { $in: ['pending', 'accepted'] },
    })
      .populate('user', 'name email phone age occupation')
      .sort({ appointmentDate: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalAppointments,
        pendingRequests,
        acceptedAppointments,
        completedAppointments,
      },
      upcomingAppointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user summary for a counselor who has a scheduled appointment with them
// @route   GET /api/counselor/patient/:userId
// @access  Private (Counselor)
exports.getPatientDetails = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check that this counselor actually has an appointment with the user
    const hasRelation = await Appointment.findOne({
      counselor: req.user.id,
      user: userId,
    });

    if (!hasRelation && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access restricted: You do not have an active counseling relationship with this user',
      });
    }

    const patient = await User.findById(userId).select('name email phone age gender occupation bio');
    const recentAssessments = await StressAssessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);
    const recentMood = await MoodJournal.find({ user: userId })
      .sort({ entryDate: -1 })
      .limit(7);

    res.status(200).json({
      success: true,
      patient,
      recentAssessments,
      recentMood,
    });
  } catch (error) {
    next(error);
  }
};
