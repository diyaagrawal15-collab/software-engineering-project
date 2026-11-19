const StressAssessment = require('../models/StressAssessment');
const MoodJournal = require('../models/MoodJournal');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Generate comprehensive personal progress report for user
// @route   GET /api/reports/my-progress
// @access  Private
exports.getMyProgressReport = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const user = await User.findById(userId).select('name email createdAt');

    // Fetch assessments
    const assessments = await StressAssessment.find({ user: userId })
      .sort({ createdAt: 1 });

    // Fetch mood logs
    const moodEntries = await MoodJournal.find({ user: userId })
      .sort({ entryDate: 1 });

    // Fetch appointments
    const appointments = await Appointment.find({ user: userId })
      .populate('counselor', 'name specialization')
      .sort({ appointmentDate: -1 });

    // Assessment Analytics
    let assessmentScores = assessments.map((a) => ({
      date: a.createdAt.toISOString().split('T')[0],
      score: a.totalScore,
      level: a.stressLevel,
      breakdown: a.categoryBreakdown,
    }));

    const initialAssessment = assessments[0] || null;
    const latestAssessment = assessments[assessments.length - 1] || null;

    let overallProgressStatus = 'No assessments recorded yet';
    let progressDelta = 0;

    if (initialAssessment && latestAssessment && assessments.length > 1) {
      progressDelta = latestAssessment.totalScore - initialAssessment.totalScore;
      if (progressDelta < 0) {
        overallProgressStatus = `Stress decreased by ${Math.abs(progressDelta)} points since initial assessment (${initialAssessment.stressLevel} → ${latestAssessment.stressLevel}). Great progress!`;
      } else if (progressDelta > 0) {
        overallProgressStatus = `Stress score rose by ${progressDelta} points (${initialAssessment.stressLevel} → ${latestAssessment.stressLevel}). We recommend scheduling a counseling consultation.`;
      } else {
        overallProgressStatus = `Stress level maintained steady at ${latestAssessment.stressLevel}.`;
      }
    } else if (latestAssessment) {
      overallProgressStatus = `Initial baseline established: ${latestAssessment.stressLevel} Stress (${latestAssessment.totalScore}/40).`;
    }

    // Mood Summary
    const moodCounts = { great: 0, good: 0, neutral: 0, anxious: 0, stressed: 0, sad: 0, angry: 0 };
    moodEntries.forEach((m) => {
      if (moodCounts[m.mood] !== undefined) moodCounts[m.mood]++;
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          memberSince: user.createdAt,
        },
        summary: {
          totalAssessments: assessments.length,
          totalMoodLogs: moodEntries.length,
          totalAppointments: appointments.length,
          overallProgressStatus,
          currentStressLevel: latestAssessment ? latestAssessment.stressLevel : 'Not Assessed',
          currentScore: latestAssessment ? latestAssessment.totalScore : null,
        },
        assessmentTimeline: assessmentScores,
        moodDistribution: moodCounts,
        recentAppointments: appointments.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};
