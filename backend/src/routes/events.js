const express = require('express');
const Event = require('../models/Event');
const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'name');
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
});

// Get events by month
router.get('/month/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await Event.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: 1 })
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching monthly events',
      error: error.message,
    });
  }
});

// Get upcoming events
router.get('/upcoming/list', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await Event.find({
      date: { $gte: today },
    })
      .sort({ date: 1 })
      .limit(10)
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message,
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, category, recurring } =
      req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: 'Title and date are required',
      });
    }

    const newEvent = new Event({
      title,
      description,
      date: new Date(date),
      startTime,
      endTime,
      location,
      category: category || 'Other',
      recurring: recurring || false,
    });

    const saved = await newEvent.save();
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  try {
    const { title, description, date, startTime, endTime, location, category, recurring } =
      req.body;

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (date) updates.date = new Date(date);
    if (startTime) updates.startTime = startTime;
    if (endTime) updates.endTime = endTime;
    if (location) updates.location = location;
    if (category) updates.category = category;
    if (recurring !== undefined) updates.recurring = recurring;

    const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
});

module.exports = router;
