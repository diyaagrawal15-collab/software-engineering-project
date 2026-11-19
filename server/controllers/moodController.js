const MoodJournal = require('../models/MoodJournal');

// @desc    Create new mood journal entry
// @route   POST /api/mood
// @access  Private
exports.createEntry = async (req, res, next) => {
  try {
    const { mood, intensity, title, notes, tags, sleepHours, energyLevel, entryDate } = req.body;

    if (!mood || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your mood and personal reflection notes',
      });
    }

    const entry = await MoodJournal.create({
      user: req.user.id,
      mood,
      intensity: intensity || 5,
      title: title || `${mood.charAt(0).toUpperCase() + mood.slice(1)} Reflection`,
      notes,
      tags: Array.isArray(tags) ? tags : tags ? [tags] : [],
      sleepHours: sleepHours !== undefined ? sleepHours : 7,
      energyLevel: energyLevel !== undefined ? energyLevel : 5,
      entryDate: entryDate || Date.now(),
    });

    res.status(201).json({
      success: true,
      data: entry,
      message: 'Mood journal entry saved successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's mood journal entries
// @route   GET /api/mood
// @access  Private
exports.getEntries = async (req, res, next) => {
  try {
    const entries = await MoodJournal.find({ user: req.user.id })
      .sort({ entryDate: -1, createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get mood trends and statistical summary over time
// @route   GET /api/mood/trends
// @access  Private
exports.getMoodTrends = async (req, res, next) => {
  try {
    const entries = await MoodJournal.find({ user: req.user.id })
      .sort({ entryDate: 1 })
      .limit(60);

    const moodDistribution = {
      great: 0,
      good: 0,
      neutral: 0,
      anxious: 0,
      stressed: 0,
      sad: 0,
      angry: 0,
    };

    let totalIntensity = 0;
    let totalSleep = 0;
    const timeline = [];

    entries.forEach((e) => {
      if (moodDistribution[e.mood] !== undefined) {
        moodDistribution[e.mood]++;
      }
      totalIntensity += e.intensity || 5;
      totalSleep += e.sleepHours || 7;

      timeline.push({
        date: e.entryDate.toISOString().split('T')[0],
        mood: e.mood,
        intensity: e.intensity,
        sleepHours: e.sleepHours,
        energyLevel: e.energyLevel,
      });
    });

    const averageIntensity = entries.length ? (totalIntensity / entries.length).toFixed(1) : 0;
    const averageSleep = entries.length ? (totalSleep / entries.length).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalEntries: entries.length,
        averageIntensity,
        averageSleep,
        moodDistribution,
        timeline,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update single mood entry
// @route   PUT /api/mood/:id
// @access  Private
exports.updateEntry = async (req, res, next) => {
  try {
    const entry = await MoodJournal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Mood entry not found' });
    }

    // Security check: Must be entry owner
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only edit your own mood journal entries',
      });
    }

    const updatedEntry = await MoodJournal.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedEntry,
      message: 'Mood entry updated',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single mood entry
// @route   DELETE /api/mood/:id
// @access  Private
exports.deleteEntry = async (req, res, next) => {
  try {
    const entry = await MoodJournal.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Mood entry not found' });
    }

    // Security check
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete your own mood journal entries',
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Mood entry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
