const express = require('express');
const Admission = require('../models/Admission');
const auth = require('../middleware/auth');
const router = express.Router();

// @route   POST /api/admissions
// @desc    Submit a new admission application
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { guardianName, studentName, phone, studentAge, classApplying, email } = req.body;

    // Validation
    if (!guardianName || !studentName || !phone || !studentAge || !classApplying) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Create admission record
    const admission = await Admission.create({
      guardianName,
      studentName,
      phone,
      studentAge,
      classApplying,
      email: email || 'N/A',
      status: 'Applied',
    });

    res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully. Our team will contact you shortly.',
      data: admission,
    });
  } catch (error) {
    console.error('Error submitting admission:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting admission application',
    });
  }
});

// @route   GET /api/admissions
// @desc    Get all admission applications (Admin only)
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource',
      });
    }

    const admissions = await Admission.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    console.error('Error fetching admissions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admissions',
    });
  }
});

// @route   GET /api/admissions/:id
// @desc    Get a single admission application
// @access  Private (Admin)
router.get('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource',
      });
    }

    const admission = await Admission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (error) {
    console.error('Error fetching admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admission',
    });
  }
});

// @route   PUT /api/admissions/:id
// @desc    Update admission status (Admin only)
// @access  Private (Admin)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update admissions',
      });
    }

    const { status, remarks, contacted } = req.body;

    const admission = await Admission.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks,
        contacted,
        contactedDate: contacted ? new Date() : null,
      },
      { new: true, runValidators: true }
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admission updated successfully',
      data: admission,
    });
  } catch (error) {
    console.error('Error updating admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating admission',
    });
  }
});

// @route   DELETE /api/admissions/:id
// @desc    Delete an admission application
// @access  Private (Admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete admissions',
      });
    }

    const admission = await Admission.findByIdAndDelete(req.params.id);

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: 'Admission not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admission deleted successfully',
      data: admission,
    });
  } catch (error) {
    console.error('Error deleting admission:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting admission',
    });
  }
});

module.exports = router;
