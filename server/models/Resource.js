const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['article', 'helpline', 'guide', 'video', 'faq'],
      required: true,
    },
    category: {
      type: String,
      enum: ['burnout', 'anxiety', 'mindfulness', 'crisis', 'sleep', 'general'],
      default: 'general',
    },
    summary: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: '',
    },
    contactNumber: {
      type: String,
      default: '', // For helplines
    },
    availableHours: {
      type: String,
      default: '24/7',
    },
    author: {
      type: String,
      default: 'StressCare Clinical Advisory Board',
    },
    externalLink: {
      type: String,
      default: '',
    },
    readTimeMinutes: {
      type: Number,
      default: 3,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Resource', resourceSchema);
