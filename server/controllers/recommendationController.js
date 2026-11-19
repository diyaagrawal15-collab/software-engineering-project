const Recommendation = require('../models/Recommendation');
const StressAssessment = require('../models/StressAssessment');
const MoodJournal = require('../models/MoodJournal');

// @desc    Get all recommendations with optional category filter
// @route   GET /api/recommendations
// @access  Public or Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const { category, stressLevel } = req.query;
    const query = {};

    if (category) query.category = category;
    if (stressLevel) {
      query.stressLevelTarget = { $in: [stressLevel, 'All'] };
    }

    const recommendations = await Recommendation.find(query).sort({ isFeatured: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get personalized recommendations dynamically tailored to user's latest assessment & mood
// @route   GET /api/recommendations/personalized
// @access  Private
exports.getPersonalizedRecommendations = async (req, res, next) => {
  try {
    const latestAssessment = await StressAssessment.findOne({ user: req.user.id }).sort({ createdAt: -1 });
    const latestMood = await MoodJournal.findOne({ user: req.user.id }).sort({ entryDate: -1 });

    const currentStressLevel = latestAssessment ? latestAssessment.stressLevel : 'Moderate';
    const currentMood = latestMood ? latestMood.mood : 'neutral';

    // Prioritize activities matching user's stress level
    const recommendations = await Recommendation.find({
      stressLevelTarget: { $in: [currentStressLevel, 'All'] },
    }).limit(12);

    let focalAdvice = '';
    if (currentStressLevel === 'High') {
      focalAdvice = 'Immediate calm protocol: We recommend the 4-7-8 Breathing technique and Progressive Muscle Relaxation to quickly lower somatic tension.';
    } else if (currentStressLevel === 'Moderate') {
      focalAdvice = 'Pacing & Recovery: Try the Box Breathing exercise and Pomodoro pacing to restore cognitive clarity without burnout.';
    } else {
      focalAdvice = 'Sustained Wellness: Maintain your balance with mindful morning reflection, gentle stretching, and adequate hydration.';
    }

    res.status(200).json({
      success: true,
      currentStressLevel,
      currentMood,
      focalAdvice,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single recommendation details
// @route   GET /api/recommendations/:id
// @access  Public or Private
exports.getRecommendationById = async (req, res, next) => {
  try {
    const item = await Recommendation.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Recommendation item not found' });
    }
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};
