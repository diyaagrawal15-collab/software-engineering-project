const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: [true, 'Please select an appointment date'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Please select a time slot'], // e.g. "10:00 AM - 11:00 AM"
    },
    reason: {
      type: String,
      required: [true, 'Please provide the primary concern or reason for consultation'],
      trim: true,
    },
    stressLevelAtBooking: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Not Assessed'],
      default: 'Not Assessed',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    counselorNotes: {
      type: String,
      default: '',
    },
    counselorAdvice: {
      type: String,
      default: '',
    },
    meetingLink: {
      type: String,
      default: 'https://meet.google.com/session-stress-care',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ user: 1, appointmentDate: -1 });
appointmentSchema.index({ counselor: 1, appointmentDate: -1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
