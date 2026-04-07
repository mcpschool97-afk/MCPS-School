const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('admin123', 10);

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// User or admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const loginCredential = (email || username || '').toLowerCase();

    if (!loginCredential || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/Email and password are required',
      });
    }

    const user = await User.findOne({
      $or: [
        { email: loginCredential },
        { username: loginCredential },
      ],
    });

    if (user) {
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = createToken(user);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    }

    // Fallback admin login for legacy access
    const isValidAdmin = loginCredential === ADMIN_USERNAME && await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (isValidAdmin) {
      const adminUser = {
        id: 'admin-001',
        username: ADMIN_USERNAME,
        email: 'admin@eliteschool.com',
        firstName: 'Administrator',
        lastName: '',
        role: 'admin',
      };
      const token = createToken(adminUser);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: adminUser,
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
});

// Register a new user (student/parent/staff)
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, role, phone } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, last name, and role are required',
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username?.toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with that email or username already exists',
      });
    }

    const newUser = new User({
      email: email.toLowerCase(),
      username: username?.toLowerCase(),
      password,
      firstName,
      lastName,
      role,
      phone,
    });

    await newUser.save();
    const token = createToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: newUser,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
});

// Verify token endpoint
router.post('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    return res.status(200).json({
      success: true,
      message: 'Token is valid',
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: error.message,
    });
  }
});

module.exports = router;
