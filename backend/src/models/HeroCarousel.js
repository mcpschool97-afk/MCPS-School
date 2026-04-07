const mongoose = require('mongoose');

const heroCarouselSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
    },
    title: {
      type: String,
      default: 'School Moment',
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uploadedBy: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeroCarousel', heroCarouselSchema);
