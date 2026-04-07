const express = require('express');
const auth = require('../middleware/auth');
const Student = require('../models/Student');
const User = require('../models/User');

const router = express.Router();

const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

const buildUsername = (email, firstName, lastName, admissionNumber) => {
  if (email) {
    return email.split('@')[0];
  }

  const baseName = `${firstName || 'student'}${lastName ? `.${lastName}` : ''}`
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 20);

  if (admissionNumber) {
    return `${baseName}.${admissionNumber}`;
  }

  return `${baseName}.${Date.now().toString().slice(-6)}`;
};

const buildStudentResponse = (student) => {
    let fees = student.fees || {};
    if (fees.totalAmount != null && fees.paidAmount != null) {
      const totalAmount = Number(fees.totalAmount) || 0;
      const paidAmount = Number(fees.paidAmount) || 0;
      const expectedDueAmount = Math.max(totalAmount - paidAmount, 0);
      if (fees.dueAmount == null || Number(fees.dueAmount) !== expectedDueAmount) {
        fees = {
          ...fees,
          dueAmount: expectedDueAmount,
          status: fees.status || (expectedDueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'pending'),
        };
      }
    }

    return {
      _id: student._id,
      id: student._id,
      admissionNumber: student.admissionNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      dob: student.dob,
      gender: student.gender,
      className: student.className,
      section: student.section,
      rollNumber: student.rollNumber,
      age: student.age,
      address: student.address,
      city: student.city,
      state: student.state,
      postalCode: student.postalCode,
      profileImage: student.profileImage,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      parentEmail: student.parentEmail,
      parent: student.parent ? {
        id: student.parent._id || student.parent,
        email: student.parent.email,
        username: student.parent.username,
        firstName: student.parent.firstName,
        lastName: student.parent.lastName,
      } : undefined,
      user: student.user ? {
        id: student.user._id || student.user,
        email: student.user.email,
        username: student.user.username,
        firstName: student.user.firstName,
        lastName: student.user.lastName,
      } : undefined,
      attendance: student.attendance,
      results: student.results,
      fees,
      notes: student.notes,
    };
  };

// Get the current user's student profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = req.user;

    if (user.role === 'student') {
      const student = await Student.findOne({ user: user.id });
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student profile not found' });
      }
      return res.status(200).json({ success: true, data: buildStudentResponse(student) });
    }

    if (user.role === 'parent') {
      const students = await Student.find({ parent: user.id });
      return res.status(200).json({ success: true, data: students.map(buildStudentResponse) });
    }

    return res.status(403).json({ success: false, message: 'Access denied' });
  } catch (error) {
    console.error('Fetch student profile error:', error);
    res.status(500).json({ success: false, message: 'Error fetching profile', error: error.message });
  }
});

// Get all students (admin/staff)
router.get('/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const students = await Student.find().sort({ createdAt: -1 }).populate('user', 'email username firstName lastName').populate('parent', 'email username firstName lastName');
    return res.status(200).json({ success: true, data: students.map(buildStudentResponse) });
  } catch (error) {
    console.error('Fetch students list error:', error);
    res.status(500).json({ success: false, message: 'Error fetching students', error: error.message });
  }
});

// Get a specific student profile if the user has access
router.get('/:id', auth, async (req, res) => {
  try {
    const user = req.user;
    const student = await Student.findById(req.params.id).populate('user', 'email username firstName lastName').populate('parent', 'email username firstName lastName');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    if (user.role === 'admin' || user.role === 'staff') {
      return res.status(200).json({ success: true, data: buildStudentResponse(student) });
    }

    if (user.role === 'student' && student.user?.toString() === user.id) {
      return res.status(200).json({ success: true, data: buildStudentResponse(student) });
    }

    if (user.role === 'parent' && student.parent?.toString() === user.id) {
      return res.status(200).json({ success: true, data: buildStudentResponse(student) });
    }

    return res.status(403).json({ success: false, message: 'Access denied' });
  } catch (error) {
    console.error('Fetch student by id error:', error);
    res.status(500).json({ success: false, message: 'Error fetching student', error: error.message });
  }
});

// Create student profile and automatically create a linked student user
router.post('/', auth, async (req, res) => {
  let createdStudentUser = null;
  let createdParentUser = null;
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can create student profiles' });
    }

    const {
      parentEmail,
      parentName,
      parentPhone,
      parentPassword,
      studentPassword,
      firstName,
      lastName,
      admissionNumber,
      ...studentData
    } = req.body;

    if (!parentEmail) {
      return res.status(400).json({ success: false, message: 'Parent email is required for parent portal login' });
    }

    const studentEmail = `${firstName?.toLowerCase() || 'student'}.${admissionNumber || Date.now()}@meridianprogressive.school`;
    const studentUsername = buildUsername(studentEmail, firstName, lastName, admissionNumber);
    const generatedStudentPassword = studentPassword || generateRandomString(12);
    const studentUserPayload = {
      email: studentEmail.toLowerCase(),
      username: studentUsername,
      password: generatedStudentPassword,
      firstName,
      lastName,
      role: 'student',
    };

    createdStudentUser = new User(studentUserPayload);
    await createdStudentUser.save();

    const parentEmailLower = parentEmail.toLowerCase();
    let parentUser = await User.findOne({ email: parentEmailLower, role: 'parent' });
    const generatedParentPassword = parentPassword || generateRandomString(12);
    let parentPasswordUsed = null;

    if (!parentUser) {
      parentUser = new User({
        email: parentEmailLower,
        username: parentEmailLower.split('@')[0],
        password: generatedParentPassword,
        firstName: parentName?.split(' ')[0] || 'Parent',
        lastName: parentName?.split(' ').slice(1).join(' ') || '',
        role: 'parent',
        phone: parentPhone,
      });
      createdParentUser = parentUser;
      parentPasswordUsed = generatedParentPassword;
      await parentUser.save();
    } else {
      if (parentPassword) {
        parentUser.password = generatedParentPassword;
        parentPasswordUsed = generatedParentPassword;
      }
      if (parentName) {
        parentUser.firstName = parentName.split(' ')[0] || parentUser.firstName;
        parentUser.lastName = parentName.split(' ').slice(1).join(' ') || parentUser.lastName;
      }
      if (parentPhone) {
        parentUser.phone = parentPhone;
      }
      if (!parentUser.parentOf) {
        parentUser.parentOf = [];
      }
      await parentUser.save();
    }

    if (!parentUser.parentOf) {
      parentUser.parentOf = [];
    }
    if (!parentUser.parentOf.some((id) => id.toString() === createdStudentUser._id.toString())) {
      parentUser.parentOf.push(createdStudentUser._id);
      await parentUser.save();
    }

    const student = new Student({
      ...studentData,
      firstName,
      lastName,
      admissionNumber,
      user: createdStudentUser._id,
      parent: parentUser._id,
      parentEmail: parentEmailLower,
      parentName,
      parentPhone,
    });
    await student.save();

    createdStudentUser.studentId = student._id;
    await createdStudentUser.save();

    await student.populate({ path: 'user', select: 'email username firstName lastName' });
    await student.populate({ path: 'parent', select: 'email username firstName lastName' });

    res.status(201).json({
      success: true,
      message: 'Student profile and accounts created',
      data: buildStudentResponse(student),
      credentials: {
        parent: {
          email: parentUser.email,
          password: parentPasswordUsed,
        },
        student: {
          email: createdStudentUser.email,
          username: createdStudentUser.username,
          password: generatedStudentPassword,
        },
      },
    });
  } catch (error) {
    console.error('Create student profile error:', error);
    if (createdParentUser && createdParentUser._id) {
      await User.findByIdAndDelete(createdParentUser._id).catch(() => null);
    }
    if (createdStudentUser && createdStudentUser._id) {
      await User.findByIdAndDelete(createdStudentUser._id).catch(() => null);
    }
    res.status(500).json({ success: false, message: 'Error creating student profile', error: error.message });
  }
});

// Update student profile
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can update student profiles' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Extract parent-related and fees fields separately
    const { 
      parentEmail, 
      parentName, 
      parentPhone, 
      parentPassword,
      fees: incomingFees,
      ...studentFields 
    } = req.body;

    // Update simple student fields (skip undefined values)
    Object.keys(studentFields).forEach((key) => {
      const value = studentFields[key];
      // Only update if value is provided (not undefined or null)
      if (value !== undefined && value !== null) {
        student[key] = value;
      }
    });

    // Handle fees update separately for nested object
    if (incomingFees) {
      if (!student.fees) {
        student.fees = {};
      }
      
      // Update each fee field individually
      if (incomingFees.totalAmount !== undefined && incomingFees.totalAmount !== null) {
        student.fees.totalAmount = incomingFees.totalAmount;
      }
      if (incomingFees.paidAmount !== undefined && incomingFees.paidAmount !== null) {
        student.fees.paidAmount = incomingFees.paidAmount;
      }
      if (incomingFees.dueAmount !== undefined && incomingFees.dueAmount !== null) {
        student.fees.dueAmount = incomingFees.dueAmount;
      }
      if (incomingFees.status !== undefined && incomingFees.status !== null) {
        student.fees.status = incomingFees.status;
      }
      if (incomingFees.lastPaymentDate !== undefined && incomingFees.lastPaymentDate !== null) {
        student.fees.lastPaymentDate = incomingFees.lastPaymentDate;
      }
    }

    // Handle parent information updates
    if (parentEmail || parentName || parentPhone || parentPassword) {
      let parentUser = null;
      
      if (student.parent) {
        parentUser = await User.findById(student.parent);
      }

      // Check if changing email to a different one
      if (parentEmail && parentEmail.toLowerCase() !== student.parentEmail?.toLowerCase()) {
        const existingParent = await User.findOne({ email: parentEmail.toLowerCase(), role: 'parent' });
        if (existingParent && existingParent._id.toString() !== student.parent?.toString()) {
          parentUser = existingParent;
        } else if (!parentUser) {
          // Create new parent user if doesn't exist
          parentUser = new User({
            email: parentEmail.toLowerCase(),
            username: parentEmail.toLowerCase().split('@')[0],
            password: parentPassword || generateRandomString(12),
            firstName: parentName?.split(' ')[0] || 'Parent',
            lastName: parentName?.split(' ').slice(1).join(' ') || '',
            role: 'parent',
            phone: parentPhone,
          });
          await parentUser.save();
        }
      }

      // Update existing parent user if found
      if (parentUser) {
        let userUpdated = false;

        if (parentPassword && parentPassword !== 'current-password-unchanged') {
          parentUser.password = parentPassword;
          userUpdated = true;
        }
        
        if (parentName) {
          const nameParts = parentName.split(' ');
          parentUser.firstName = nameParts[0] || parentUser.firstName;
          parentUser.lastName = nameParts.slice(1).join(' ') || parentUser.lastName;
          userUpdated = true;
        }
        
        if (parentPhone) {
          parentUser.phone = parentPhone;
          userUpdated = true;
        }
        
        if (parentEmail && parentEmail.toLowerCase() !== parentUser.email) {
          parentUser.email = parentEmail.toLowerCase();
          parentUser.username = parentEmail.toLowerCase().split('@')[0];
          userUpdated = true;
        }
        
        if (userUpdated) {
          await parentUser.save();
        }
        
        // Link parent to student if not already linked
        student.parent = parentUser._id;
      }

      // Update student's parent contact info
      if (parentEmail) {
        student.parentEmail = parentEmail.toLowerCase();
      }
      if (parentName) {
        student.parentName = parentName;
      }
      if (parentPhone) {
        student.parentPhone = parentPhone;
      }
    }

    // Save the updated student
    await student.save();
    
    // Refetch student with populated references
    const updatedStudent = await Student.findById(student._id)
      .populate('user', 'email username firstName lastName')
      .populate('parent', 'email username firstName lastName');
    
    res.status(200).json({ 
      success: true, 
      message: 'Student profile updated successfully', 
      data: buildStudentResponse(updatedStudent) 
    });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating student profile: ' + error.message, 
      error: error.message 
    });
  }
});

// Delete student profile and related accounts
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Only admin or staff can delete student profiles' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    // Delete student user account if exists
    if (student.user) {
      await User.findByIdAndDelete(student.user).catch(() => null);
    }

    // Remove student from parent's parentOf array and delete parent if no other students
    if (student.parent) {
      const parentUser = await User.findById(student.parent);
      if (parentUser) {
        if (parentUser.parentOf) {
          parentUser.parentOf = parentUser.parentOf.filter((id) => id.toString() !== student._id.toString());
        }
        // Delete parent user if they have no other students
        if (!parentUser.parentOf || parentUser.parentOf.length === 0) {
          await User.findByIdAndDelete(student.parent).catch(() => null);
        } else {
          await parentUser.save();
        }
      }
    }

    // Delete student profile
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Student profile and related accounts deleted successfully' });
  } catch (error) {
    console.error('Delete student profile error:', error);
    res.status(500).json({ success: false, message: 'Error deleting student profile', error: error.message });
  }
});

module.exports = router;
