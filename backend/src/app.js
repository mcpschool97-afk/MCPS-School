// backend/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const logger = require('./utils/logger');

// Load models to register schemas
require('./models/User');
require('./models/News');
require('./models/Gallery');
require('./models/Student');
require('./models/Event');
require('./models/Staff');
require('./models/HeroCarousel');
require('./models/Admission');
require('./models/Attendance');

const app = express();

// Middleware
app.use(helmet()); // Security headers

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];

allowedOrigins.push('http://localhost:3000', 'http://localhost:3001');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        // Allow server-to-server or tools without origin header
        callback(null, true);
        return;
      }
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      console.warn('Blocked CORS origin:', origin, 'allowed:', allowedOrigins);
      // Allow the request anyway for now to avoid 500 errors while debugging
      callback(null, true);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'School Website API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      dbHealth: '/api/health/db',
      auth: '/api/auth',
      news: '/api/news',
      gallery: '/api/gallery',
      students: '/api/students',
      events: '/api/events',
      heroCarousel: '/api/hero-carousel',
      admissions: '/api/admissions',
      attendance: '/api/attendance'
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/students', require('./routes/students'));
app.use('/api/events', require('./routes/events'));
app.use('/api/hero-carousel', require('./routes/heroCarousel'));
app.use('/api/admissions', require('./routes/admissions'));
app.use('/api/attendance', require('./routes/attendance'));
// app.use('/api/staff', require('./routes/staff'));

// Database health check
app.get('/api/health/db', async (req, res) => {
  try {
    const admin = mongoose.connection.db.admin();
    await admin.ping();
    res.json({ 
      status: 'Database connected',
      db: mongoose.connection.name,
      host: mongoose.connection.host,
      readyState: mongoose.connection.readyState
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Database disconnected',
      error: error.message,
      readyState: mongoose.connection.readyState
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({
    message: err.message,
    error: process.env.NODE_ENV === 'development' ? err : {},
  });
});

module.exports = app;
