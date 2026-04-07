const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    admissionNumber: {
      type: String,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    dob: Date,
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    className: String,
    section: String,
    rollNumber: String,
    age: Number,
    address: String,
    city: String,
    state: String,
    postalCode: String,
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    parentName: String,
    parentPhone: String,
    parentEmail: String,
    profileImage: String,
    attendance: [
      {
        month: String,
        year: Number,
        totalDays: Number,
        presentDays: Number,
        absentDays: Number,
        percentage: Number,
      },
    ],
    results: [
      {
        examName: String,
        term: String,
        year: Number,
        subjects: [
          {
            subject: String,
            marksObtained: Number,
            maximumMarks: Number,
            grade: String,
          },
        ],
        totalMarks: Number,
        percentage: Number,
        grade: String,
      },
    ],
    fees: {
      totalAmount: Number,
      paidAmount: {
        type: Number,
        default: 0,
      },
      dueAmount: {
        type: Number,
        default: 0,
      },
      status: {
        type: String,
        enum: ['paid', 'partial', 'pending'],
        default: 'pending',
      },
      lastPaymentDate: Date,
    },
    notes: String,
  },
  { timestamps: true }
);

studentSchema.pre('save', function(next) {
  if (this.fees) {
    const totalAmount = this.fees.totalAmount != null ? Number(this.fees.totalAmount) : null;
    const paidAmount = this.fees.paidAmount != null ? Number(this.fees.paidAmount) : 0;

    if (totalAmount !== null && !Number.isNaN(totalAmount) && !Number.isNaN(paidAmount)) {
      const calculatedDue = Math.max(totalAmount - paidAmount, 0);
      this.fees.dueAmount = calculatedDue;

      if (totalAmount === 0 && paidAmount === 0) {
        this.fees.status = this.fees.status || 'pending';
      } else if (calculatedDue === 0) {
        this.fees.status = 'paid';
      } else if (paidAmount > 0) {
        this.fees.status = 'partial';
      } else {
        this.fees.status = 'pending';
      }
    }
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema);
