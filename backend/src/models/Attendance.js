const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    date_key: {
      type: String,
      sparse: true,
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'leave'],
      required: true,
    },
    remarks: String,
    markedBy: {
      type: String,
      default: null,
    },
    smsNotificationSent: {
      type: Boolean,
      default: false,
    },
    smsNotificationError: String,
  },
  { timestamps: true }
);

// Index for faster queries
attendanceSchema.index({ student: 1, date: 1 });
attendanceSchema.index({ student: 1, date: -1 });

// Optional: Use a sparse unique index if you want to prevent exact duplicates
// Note: This uses a custom comparison that treats dates on the same day as duplicates
attendanceSchema.index(
  { 
    student: 1,
    'date_key': 1
  },
  { unique: true, sparse: true }
);

// Pre-save hook to set date_key for unique index
attendanceSchema.pre('save', function(next) {
  if (this.date) {
    const d = new Date(this.date);
    this.date_key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Attendance', attendanceSchema);
