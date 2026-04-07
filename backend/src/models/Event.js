const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    date: {
      type: Date,
      required: true,
    },
    startTime: String,
    endTime: String,
    location: String,
    category: {
      type: String,
      enum: ['Academic', 'Sports', 'Cultural', 'Holiday', 'Exam', 'Other'],
      default: 'Other',
    },
    recurring: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
