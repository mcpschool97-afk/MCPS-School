const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    description: String,
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    images: [
      {
        imageUrl: String,
        publicId: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
