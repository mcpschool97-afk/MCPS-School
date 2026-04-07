const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema(
  {
    guardianName: {
      type: String,
      required: [true, 'Guardian name is required'],
      trim: true,
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    studentAge: {
      type: Number,
      required: [true, 'Student age is required'],
      min: 3,
      max: 18,
    },
    classApplying: {
      type: String,
      required: [true, 'Class for admission is required'],
      enum: [
        'Nursery',
        'KG',
        'Class 1',
        'Class 2',
        'Class 3',
        'Class 4',
        'Class 5',
        'Class 6',
        'Class 7',
        'Class 8',
        'Class 9',
        'Class 10',
        'Class 11',
        'Class 12',
      ],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Admitted', 'Rejected'],
      default: 'Applied',
    },
    remarks: {
      type: String,
      trim: true,
    },
    contacted: {
      type: Boolean,
      default: false,
    },
    contactedDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admission', admissionSchema);
