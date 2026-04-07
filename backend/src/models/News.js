// backend/src/models/News.js
const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: String,
    featuredImage: String,
    featuredImagePublicId: String,
    category: {
      type: String,
      default: 'General',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isLatestUpdate: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('News', newsSchema);
