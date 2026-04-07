const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const cloudinary = require('../config/cloudinary');
const News = require('../models/News');
const router = express.Router();

const tmpDir = path.join(__dirname, '..', '..', 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: tmpDir });

// Get all published news
router.get('/', async (req, res) => {
  try {
    const { category, latest, limit } = req.query;
    const query = { isPublished: true };

    if (category) {
      query.category = category;
    }
    if (latest === 'true') {
      query.isLatestUpdate = true;
    }

    let newsQuery = News.find(query)
      .sort({ publishedAt: -1 })
      .populate('author', 'firstName lastName email');

    const parsedLimit = Number(limit);
    if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
      newsQuery = newsQuery.limit(parsedLimit);
    }

    const news = await newsQuery.lean();

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
  }
});

// Get all news (admin)
router.get('/admin/all', auth, async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 }).populate('author', 'name email');
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
  }
});

// Get news by ID
router.get('/:id', async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate('author', 'name email');

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching news', error: error.message });
  }
});

// Upload news image to Cloudinary
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'school-news',
      resource_type: 'image',
      use_filename: true,
      unique_filename: true,
    });

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      success: true,
      data: {
        imageUrl: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (error) {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ success: false, message: 'Error uploading image', error: error.message });
  }
});

// Create new news
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, author, featured, isPublished, isLatestUpdate, featuredImage, featuredImagePublicId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const newNews = new News({
      title,
      slug,
      content,
      excerpt,
      featuredImage: featuredImage || '',
      featuredImagePublicId: featuredImagePublicId || '',
      category: category || 'General',
      author: author || null,
      featured: featured || false,
      isLatestUpdate: isLatestUpdate || false,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null,
    });

    const saved = await newNews.save();
    res.status(201).json({ success: true, message: 'News created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating news', error: error.message });
  }
});

// Update news
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, excerpt, category, featured, isPublished, isLatestUpdate, featuredImage, featuredImagePublicId } = req.body;
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    if (title) {
      news.title = title;
      news.slug = title.toLowerCase().replace(/\s+/g, '-');
    }
    if (content) news.content = content;
    if (excerpt !== undefined) news.excerpt = excerpt;
    if (category) news.category = category;
    if (featured !== undefined) news.featured = featured;
    if (isLatestUpdate !== undefined) news.isLatestUpdate = isLatestUpdate;
    if (isPublished !== undefined) {
      news.isPublished = isPublished;
      news.publishedAt = isPublished ? new Date() : news.publishedAt;
    }

    if (featuredImage) {
      if (news.featuredImagePublicId && news.featuredImagePublicId !== featuredImagePublicId) {
        await cloudinary.uploader.destroy(news.featuredImagePublicId, { resource_type: 'image' });
      }
      news.featuredImage = featuredImage;
      news.featuredImagePublicId = featuredImagePublicId || news.featuredImagePublicId;
    }

    const saved = await news.save();
    res.status(200).json({ success: true, message: 'News updated successfully', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating news', error: error.message });
  }
});

// Delete news
router.delete('/:id', auth, async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    if (news.featuredImagePublicId) {
      await cloudinary.uploader.destroy(news.featuredImagePublicId, { resource_type: 'image' });
    }

    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting news', error: error.message });
  }
});

module.exports = router;
