const mongoose = require('mongoose');

const moodJournalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'neutral', 'anxious', 'stressed', 'sad', 'angry'],
      required: [true, 'Please select a mood'],
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    title: {
      type: String,
      trim: true,
      default: 'Daily Mood Log',
    },
    notes: {
      type: String,
      trim: true,
      required: [true, 'Please add some reflection or notes for your journal entry'],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sleepHours: {
      type: Number,
      min: 0,
      max: 24,
      default: 7,
    },
    energyLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 5,
    },
    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly query user entries sorted by date
moodJournalSchema.index({ user: 1, entryDate: -1 });

module.exports = mongoose.model('MoodJournal', moodJournalSchema);
