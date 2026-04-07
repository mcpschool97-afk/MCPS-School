const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const auth = require('../middleware/auth');
const Gallery = require('../models/Gallery');

const router = express.Router();
const tmpDir = path.join(__dirname, '..', '..', 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const upload = multer({ dest: tmpDir });

// Get all gallery events
router.get('/', async (req, res) => {
  try {
    const events = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gallery events', error: error.message });
  }
});

// Get gallery event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Gallery.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching gallery event', error: error.message });
  }
});

// Create new gallery event
router.post('/', auth, async (req, res) => {
  try {
    const { eventName, description, year } = req.body;
    if (!eventName) {
      return res.status(400).json({ success: false, message: 'Event name is required' });
    }

    const newEvent = new Gallery({
      eventName,
      description,
      year: year || new Date().getFullYear(),
      images: [],
    });

    const saved = await newEvent.save();
    res.status(201).json({ success: true, message: 'Gallery event created successfully', data: saved });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating gallery event', error: error.message });
  }
});

// Upload images to gallery event
router.post('/:id/images', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image file is required' });
    }

    const uploadResults = [];
    for (const file of req.files) {
      const uploaded = await cloudinary.uploader.upload(file.path, {
        folder: 'school-gallery',
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      });

      fs.unlinkSync(file.path);

      uploadResults.push({
        imageUrl: uploaded.secure_url,
        publicId: uploaded.public_id,
        uploadedAt: new Date(),
      });
    }

    const event = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: uploadResults } } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    res.status(200).json({ success: true, message: 'Image(s) uploaded successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading image(s)', error: error.message });
  }
});

// Delete image from gallery event
router.delete('/:id/images/:imageId', auth, async (req, res) => {
  try {
    const event = await Gallery.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    const image = event.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId, { resource_type: 'image' });
    }

    image.remove();
    await event.save();

    res.status(200).json({ success: true, message: 'Image deleted successfully', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting image', error: error.message });
  }
});

// Delete gallery event and all its images
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Gallery.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Gallery event not found' });
    }

    const publicIds = event.images.map((image) => image.publicId).filter(Boolean);
    for (const publicId of publicIds) {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }

    await event.remove();

    res.status(200).json({ success: true, message: 'Gallery event deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting gallery event', error: error.message });
  }
});

module.exports = router;
