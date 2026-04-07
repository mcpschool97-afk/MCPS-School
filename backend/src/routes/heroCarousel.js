const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');
const HeroCarousel = require('../models/HeroCarousel');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', '..', 'tmp', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'), false);
  }
};

const upload = multer({ 
  dest: uploadDir,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get hero carousel images
router.get('/', async (req, res) => {
  try {
    const images = await HeroCarousel.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching hero carousel images', error: error.message });
  }
});

// Add a hero carousel image (admin/staff only)
router.post('/', auth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ success: false, message: 'File upload error: ' + err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ success: false, message: 'Only admin or staff can add hero images' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    console.log('Uploading file to Cloudinary:', req.file.path);
    console.log('Cloudinary config:', { cloud_name: cloudinary.config().cloud_name ? 'SET' : 'MISSING' });

    let uploaded;
    try {
      uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: 'school-hero-carousel',
        resource_type: 'image',
        use_filename: false,
        unique_filename: true,
      });
      console.log('Cloudinary upload successful:', uploaded.public_id);
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError.message);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to upload to Cloudinary', 
        error: uploadError.message 
      });
    }

    // Clean up temp file
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn('Could not delete temp file:', e.message);
    }

    const newImage = new HeroCarousel({
      imageUrl: uploaded.secure_url,
      publicId: uploaded.public_id,
      title: req.body.title || 'School Moment',
      description: req.body.description || '',
      uploadedBy: req.user.id,
      isActive: true,
    });

    const saved = await newImage.save();
    console.log('Hero image saved to DB:', saved._id);
    res.status(201).json({ success: true, message: 'Hero image added successfully', data: saved });
  } catch (error) {
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn('Cleanup error:', e.message);
      }
    }
    console.error('Create hero image error:', error.message, error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding hero image: ' + error.message, 
      error: error.message 
    });
  }
});

// Delete hero carousel image (admin/staff only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can delete hero images' });
    }

    const heroImage = await HeroCarousel.findById(req.params.id);
    if (!heroImage) {
      return res.status(404).json({ success: false, message: 'Hero image not found' });
    }

    if (heroImage.publicId) {
      await cloudinary.uploader.destroy(heroImage.publicId, { resource_type: 'image' });
    }

    await HeroCarousel.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Hero image deleted' });
  } catch (error) {
    console.error('Delete hero image error:', error);
    res.status(500).json({ success: false, message: 'Error deleting hero image', error: error.message });
  }
});

module.exports = router;
