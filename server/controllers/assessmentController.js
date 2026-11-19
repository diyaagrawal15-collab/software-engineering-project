const StressAssessment = require('../models/StressAssessment');

// PSS-10 standard questions definitions
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    text: 'In the last month, how often have you been upset because of something that happened unexpectedly?',
    category: 'emotional',
    isReversed: false,
  },
  {
    id: 2,
    text: 'In the last month, how often have you felt that you were unable to control the important things in your life?',
    category: 'cognitive',
    isReversed: false,
  },
  {
    id: 3,
    text: 'In the last month, how often have you felt nervous and stressed?',
    category: 'emotional',
    isReversed: false,
  },
  {
    id: 4,
    text: 'In the last month, how often have you felt confident about your ability to handle your personal problems?',
    category: 'cognitive',
    isReversed: true, // reverse scored
  },
  {
    id: 5,
    text: 'In the last month, how often have you felt that things were going your way?',
    category: 'emotional',
    isReversed: true, // reverse scored
  },
  {
    id: 6,
    text: 'In the last month, how often have you found that you could not cope with all the things that you had to do?',
    category: 'behavioral',
    isReversed: false,
  },
  {
    id: 7,
    text: 'In the last month, how often have you been able to control irritations in your life?',
    category: 'emotional',
    isReversed: true, // reverse scored
  },
  {
    id: 8,
    text: 'In the last month, how often have you felt that you were on top of things?',
    category: 'cognitive',
    isReversed: true, // reverse scored
  },
  {
    id: 9,
    text: 'In the last month, how often have you been angered because of things that happened outside of your control?',
    category: 'behavioral',
    isReversed: false,
  },
  {
    id: 10,
    text: 'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?',
    category: 'physical',
    isReversed: false,
  },
];

const RESPONSE_LABELS = {
  0: 'Never',
  1: 'Almost Never',
  2: 'Sometimes',
  3: 'Fairly Often',
  4: 'Very Often',
};

// @desc    Get assessment questionnaire
// @route   GET /api/assessments/questions
// @access  Public or Private
exports.getQuestions = (req, res) => {
  const questionsForClient = ASSESSMENT_QUESTIONS.map((q) => ({
    id: q.id,
    text: q.text,
    category: q.category,
    options: [
      { label: 'Never', value: 0 },
      { label: 'Almost Never', value: 1 },
      { label: 'Sometimes', value: 2 },
      { label: 'Fairly Often', value: 3 },
      { label: 'Very Often', value: 4 },
    ],
  }));

  res.status(200).json({
    success: true,
    data: questionsForClient,
    scoringMethodology: {
      framework: 'Perceived Stress Scale (PSS-10)',
      scale: '0 to 40 points',
      thresholds: {
        low: '0 - 13 points (Low Perceived Stress)',
        moderate: '14 - 26 points (Moderate Perceived Stress)',
        high: '27 - 40 points (High Perceived Stress)',
      },
    },
  });
};

// @desc    Submit stress assessment responses and calculate scores
// @route   POST /api/assessments
// @access  Private
exports.submitAssessment = async (req, res, next) => {
  try {
    const { answers } = req.body; // array of { questionId, responseValue }

    if (!answers || !Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({
        success: false,
        message: 'Please answer all 10 questions to complete the stress assessment',
      });
    }

    let totalScore = 0;
    const categoryTotals = { emotional: 0, physical: 0, cognitive: 0, behavioral: 0 };
    const processedAnswers = [];

    ASSESSMENT_QUESTIONS.forEach((q) => {
      const submitted = answers.find((a) => Number(a.questionId) === q.id);
      const rawValue = submitted ? Number(submitted.responseValue) : 2;
      const clampedValue = Math.min(Math.max(rawValue, 0), 4);

      // Score calculation: reverse scored items 4, 5, 7, 8
      const calculatedScore = q.isReversed ? 4 - clampedValue : clampedValue;

      totalScore += calculatedScore;
      categoryTotals[q.category] += calculatedScore;

      processedAnswers.push({
        questionId: q.id,
        questionText: q.text,
        category: q.category,
        responseValue: clampedValue,
        responseLabel: RESPONSE_LABELS[clampedValue] || 'Sometimes',
      });
    });

    // Determine Stress Level
    let stressLevel = 'Low';
    let summaryText = '';
    let recommendedActions = [];
    let primaryStressors = [];

    if (totalScore <= 13) {
      stressLevel = 'Low';
      summaryText =
        'Your score indicates low perceived stress. You are currently handling daily pressures well and maintaining emotional balance.';
      recommendedActions = [
        'Maintain your healthy routines, hydration, and sleep hygiene.',
        'Engage in regular light exercise or mindfulness to sustain calm.',
        'Keep a daily mood journal to track what contributes to your peace.',
      ];
    } else if (totalScore <= 26) {
      stressLevel = 'Moderate';
      summaryText =
        'Your score indicates moderate perceived stress. While manageable, prolonged moderate stress can impact your productivity, mood, and sleep.';
      recommendedActions = [
        'Practice structured 4-7-8 or Box breathing exercises twice daily.',
        'Schedule focused 15-minute relaxation breaks during busy days.',
        'Review your workload and apply time-management techniques.',
        'Consider booking a guidance session with a certified counselor.',
      ];
      if (categoryTotals.emotional > 6) primaryStressors.push('Emotional Overwhelm');
      if (categoryTotals.cognitive > 6) primaryStressors.push('Control & Decision Strain');
      if (categoryTotals.behavioral > 4) primaryStressors.push('Coping Fatigue');
    } else {
      stressLevel = 'High';
      summaryText =
        'Your score indicates high perceived stress. You may feel overwhelmed, exhausted, or struggling to regain a sense of control over circumstances.';
      recommendedActions = [
        'Prioritize rest and immediate grounding exercises (e.g. 5-4-3-2-1 technique).',
        'Book a 1-on-1 counseling session with our verified wellness counselors.',
        'Temporarily delegate non-essential tasks to decompress.',
        'Reach out to trusted friends, family, or our confidential helpline resources.',
      ];
      primaryStressors.push('High Perceived Pressure', 'Emotional Burnout Potential');
      if (categoryTotals.cognitive > 6) primaryStressors.push('Intense Decision Fatigue');
      if (categoryTotals.physical > 3) primaryStressors.push('Somatic / Physical Tension');
    }

    // Save to database
    const assessment = await StressAssessment.create({
      user: req.user.id,
      answers: processedAnswers,
      totalScore,
      stressLevel,
      summaryText,
      categoryBreakdown: categoryTotals,
      primaryStressors,
      recommendedActions,
    });

    // Check previous assessment to provide immediate comparison
    const previous = await StressAssessment.findOne({
      user: req.user.id,
      _id: { $ne: assessment._id },
    }).sort({ createdAt: -1 });

    let comparison = null;
    if (previous) {
      const scoreDiff = assessment.totalScore - previous.totalScore;
      comparison = {
        previousDate: previous.createdAt,
        previousScore: previous.totalScore,
        previousLevel: previous.stressLevel,
        scoreDiff,
        trend: scoreDiff > 0 ? 'increased' : scoreDiff < 0 ? 'improved' : 'unchanged',
      };
    }

    res.status(201).json({
      success: true,
      data: assessment,
      comparison,
      message: 'Assessment completed and securely recorded',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's assessment history
// @route   GET /api/assessments/history
// @access  Private
exports.getHistory = async (req, res, next) => {
  try {
    const history = await StressAssessment.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest assessment for user
// @route   GET /api/assessments/latest
// @access  Private
exports.getLatest = async (req, res, next) => {
  try {
    const latest = await StressAssessment.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: latest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assessment by ID
// @route   GET /api/assessments/:id
// @access  Private
exports.getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await StressAssessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment record not found' });
    }

    // Role check: Only the owning user, or an authorized counselor or admin can view
    if (
      assessment.user.toString() !== req.user.id &&
      req.user.role !== 'counselor' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You do not have permission to view this assessment',
      });
    }

    res.status(200).json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare two assessments
// @route   GET /api/assessments/compare/:id1/:id2
// @access  Private
exports.compareAssessments = async (req, res, next) => {
  try {
    const { id1, id2 } = req.params;
    const a1 = await StressAssessment.findById(id1);
    const a2 = await StressAssessment.findById(id2);

    if (!a1 || !a2) {
      return res.status(404).json({ success: false, message: 'One or both assessment records not found' });
    }

    // Security check
    if (
      (a1.user.toString() !== req.user.id || a2.user.toString() !== req.user.id) &&
      req.user.role !== 'counselor' &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const scoreDifference = a2.totalScore - a1.totalScore;
    const comparison = {
      assessment1: a1,
      assessment2: a2,
      scoreDifference,
      status: scoreDifference < 0 ? 'Improved (Stress reduced)' : scoreDifference > 0 ? 'Increased stress' : 'Stable',
      categoryComparison: {
        emotional: a2.categoryBreakdown.emotional - a1.categoryBreakdown.emotional,
        physical: a2.categoryBreakdown.physical - a1.categoryBreakdown.physical,
        cognitive: a2.categoryBreakdown.cognitive - a1.categoryBreakdown.cognitive,
        behavioral: a2.categoryBreakdown.behavioral - a1.categoryBreakdown.behavioral,
      },
    };

    res.status(200).json({
      success: true,
      data: comparison,
    });
  } catch (error) {
    next(error);
  }
};
