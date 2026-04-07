const express = require('express');
const auth = require('../middleware/auth');
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const User = require('../models/User');

const router = express.Router();

// Mark attendance (admin/staff only) - UPDATE OR CREATE
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can mark attendance' });
    }

    const { student, date, status, remarks } = req.body;

    console.log('Attendance request received:', { student, date, status, remarks });

    // Validate inputs
    if (!student || !date || !status) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student, date, and status are required',
        received: { student, date, status }
      });
    }

    // Trim and validate studentId
    const studentId = String(student).trim();
    if (!studentId || studentId === 'undefined' || studentId === 'null') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid student ID provided'
      });
    }

    if (!['present', 'absent', 'leave'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    // Validate and parse the date (must be YYYY-MM-DD format)
    if (!date || typeof date !== 'string' || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ success: false, message: 'Date must be in YYYY-MM-DD format' });
    }

    // Parse date string (YYYY-MM-DD) into local date range
    const [year, month, day] = date.split('-');
    const startOfDay = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
    const formattedDateKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

    // Prepare update data
    const attendanceData = {
      status,
      remarks: remarks || '',
    };

    // Add markedBy only if user ID exists
    if (req.user && req.user.id) {
      attendanceData.markedBy = req.user.id;
    }

    // Use findOneAndUpdate for upsert - finds existing or creates new with complete fields
    const attendance = await Attendance.findOneAndUpdate(
      {
        student: studentId,
        date: {
          $gte: startOfDay,
          $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        $set: attendanceData,
        $setOnInsert: {
          student: studentId,
          date: startOfDay,
          date_key: formattedDateKey,
        },
      },
      {
        new: true, // Return updated document
        upsert: true, // Create if it doesn't exist
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );
    
    console.log('Attendance saved successfully:', attendance);
    res.status(201).json({ success: true, data: attendance, message: 'Attendance marked successfully' });
  
  } catch (error) {
    console.error('Mark attendance error - Message:', error.message);
    console.error('Mark attendance error - Stack:', error.stack);
    console.error('Full error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error marking attendance', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// Get attendance for a student (student can view own, parent can view children's, admin/staff can view any)
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const user = req.user;
    const studentId = req.params.studentId;

    // Find the student to verify parent relationship
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Authorization checks
    const isOwnStudent = user.role === 'student' && user.id === student.user;
    const isParentOfStudent = user.role === 'parent' && user.id === String(student.parent);
    const isAdminOrStaff = user.role === 'admin' || user.role === 'staff';

    if (!isOwnStudent && !isParentOfStudent && !isAdminOrStaff) {
      return res.status(403).json({ success: false, message: 'Access denied - You can only view your own or your children\'s attendance' });
    }

    const attendance = await Attendance.find({ student: studentId })
      .sort({ date: -1 })
      .populate('markedBy', 'firstName lastName email');

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Get attendance for a date range
router.get('/range/:studentId', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
    }

    const attendance = await Attendance.find({
      student: req.params.studentId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    })
      .sort({ date: -1 })
      .populate('markedBy', 'firstName lastName email');

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Get attendance range error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Get attendance for a specific date by class (for UI refresh)
router.get('/by-date/:className', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    // Validate and parse date (must be YYYY-MM-DD format)
    if (typeof date !== 'string' || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ success: false, message: 'Date must be in YYYY-MM-DD format' });
    }

    // Parse date string (YYYY-MM-DD) into local date range
    const [year, month, day] = date.split('-');
    const startOfDay = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Find all students in the class
    const students = await Student.find({ className: req.params.className }).select('_id');
    const studentIds = students.map((s) => s._id);

    // Get attendance records for this date and class
    const attendance = await Attendance.find({
      student: { $in: studentIds },
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .populate('student', 'firstName lastName rollNumber _id')
      .populate('markedBy', 'firstName lastName');

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Get attendance by date error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Get all attendance for a class/date (admin view)
router.get('/class/:className', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }

    // Validate and parse date (must be YYYY-MM-DD format)
    if (typeof date !== 'string' || !date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ success: false, message: 'Date must be in YYYY-MM-DD format' });
    }

    // Parse date string (YYYY-MM-DD) into local date range
    const [year, month, day] = date.split('-');
    const startOfDay = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0, 0);
    const endOfDay = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999);

    // Find all students in the class
    const students = await Student.find({ className: req.params.className }).select('_id');
    const studentIds = students.map((s) => s._id);

    const attendance = await Attendance.find({
      student: { $in: studentIds },
      date: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .populate('student', 'firstName lastName rollNumber')
      .populate('markedBy', 'firstName lastName');

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Get class attendance error:', error);
    res.status(500).json({ success: false, message: 'Error fetching attendance', error: error.message });
  }
});

// Update attendance
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can update attendance' });
    }

    const { status, remarks } = req.body;

    if (status && !['present', 'absent', 'leave'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    if (status) {
      attendance.status = status;
    }
    if (remarks) {
      attendance.remarks = remarks;
    }

    await attendance.save();
    await attendance.populate('student', 'firstName lastName').populate('markedBy', 'firstName lastName');

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Update attendance error:', error);
    res.status(500).json({ success: false, message: 'Error updating attendance', error: error.message });
  }
});

// Delete attendance
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can delete attendance' });
    }

    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: 'Attendance record not found' });
    }

    res.status(200).json({ success: true, message: 'Attendance record deleted' });
  } catch (error) {
    console.error('Delete attendance error:', error);
    res.status(500).json({ success: false, message: 'Error deleting attendance', error: error.message });
  }
});

module.exports = router;
