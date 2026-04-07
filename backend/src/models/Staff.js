// backend/src/models/Staff.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    qualification: String,
    designation: String,
    department: String,
    experience: Number,
    profileImage: String,
    bio: String,
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Staff', staffSchema);
