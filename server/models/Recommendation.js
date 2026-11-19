const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'breathing',
        'meditation',
        'physical_activity',
        'time_management',
        'relaxation',
        'healthy_habits',
        'article',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      default: '',
    },
    steps: [
      {
        type: String,
      },
    ],
    durationMinutes: {
      type: Number,
      default: 5,
    },
    stressLevelTarget: {
      type: [String],
      enum: ['Low', 'Moderate', 'High', 'All'],
      default: ['All'],
    },
    tags: [
      {
        type: String,
      },
    ],
    icon: {
      type: String,
      default: 'Heart',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Recommendation', recommendationSchema);
