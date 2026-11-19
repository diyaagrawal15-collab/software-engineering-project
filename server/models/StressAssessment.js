const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['emotional', 'physical', 'cognitive', 'behavioral'],
    default: 'emotional',
  },
  responseValue: {
    type: Number, // 0 to 4
    required: true,
  },
  responseLabel: {
    type: String,
    required: true, // 'Never', 'Almost Never', 'Sometimes', 'Fairly Often', 'Very Often'
  },
});

const stressAssessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    answers: [answerSchema],
    totalScore: {
      type: Number,
      required: true,
      min: 0,
      max: 40,
    },
    stressLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },
    summaryText: {
      type: String,
      required: true,
    },
    categoryBreakdown: {
      emotional: { type: Number, default: 0 },
      physical: { type: Number, default: 0 },
      cognitive: { type: Number, default: 0 },
      behavioral: { type: Number, default: 0 },
    },
    primaryStressors: [
      {
        type: String,
      },
    ],
    recommendedActions: [
      {
        type: String,
      },
    ],
    disclaimer: {
      type: String,
      default:
        'This assessment is a personal stress evaluation tool based on validated psychological questionnaires (PSS-10). It is designed for self-awareness and wellness tracking and does not constitute a clinical psychological or psychiatric diagnosis. If you are experiencing overwhelming distress, please consult a licensed healthcare professional or contact crisis support services.',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('StressAssessment', stressAssessmentSchema);
