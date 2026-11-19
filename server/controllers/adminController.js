const User = require('../models/User');
const StressAssessment = require('../models/StressAssessment');
const MoodJournal = require('../models/MoodJournal');
const Appointment = require('../models/Appointment');
const Resource = require('../models/Resource');

// @desc    Get Admin System Statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalCounselors = await User.countDocuments({ role: 'counselor' });
    const totalAssessments = await StressAssessment.countDocuments();
    const totalMoodEntries = await MoodJournal.countDocuments();
    const totalAppointments = await Appointment.countDocuments();

    // Aggregated stress level distribution
    const highStressCount = await StressAssessment.countDocuments({ stressLevel: 'High' });
    const moderateStressCount = await StressAssessment.countDocuments({ stressLevel: 'Moderate' });
    const lowStressCount = await StressAssessment.countDocuments({ stressLevel: 'Low' });

    const recentUsers = await User.find().select('-password').sort({ createdAt: -1 }).limit(8);
    const recentAppointments = await Appointment.find()
      .populate('user', 'name email')
      .populate('counselor', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCounselors,
        totalAssessments,
        totalMoodEntries,
        totalAppointments,
        stressDistribution: {
          high: highStressCount,
          moderate: moderateStressCount,
          low: lowStressCount,
        },
      },
      recentUsers,
      recentAppointments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with filtering
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role or verification status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isVerified, isAvailable } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (isVerified !== undefined) user.isVerified = isVerified;
    if (isAvailable !== undefined) user.isAvailable = isAvailable;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
      message: 'User updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.role === 'admin' && user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Cannot delete yourself' });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User successfully removed' });
  } catch (error) {
    next(error);
  }
};

// @desc    Create educational or helpline resource
// @route   POST /api/admin/resources
// @access  Private (Admin)
exports.createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({
      success: true,
      data: resource,
      message: 'Resource published successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get resources
// @route   GET /api/admin/resources
// @access  Public
exports.getResources = async (req, res, next) => {
  try {
    const { type, isEmergency } = req.query;
    const query = {};
    if (type) query.type = type;
    if (isEmergency !== undefined) query.isEmergency = isEmergency === 'true';

    const resources = await Resource.find(query).sort({ isEmergency: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource
// @route   DELETE /api/admin/resources/:id
// @access  Private (Admin)
exports.deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }
    await resource.deleteOne();
    res.status(200).json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    next(error);
  }
};
