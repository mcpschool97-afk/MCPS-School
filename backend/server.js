// backend/server.js
require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  let dbConnected = false;

  try {
    // Attempt to connect to the database
    await connectDB();
    dbConnected = true;
  } catch (error) {
    logger.error(`Database connection failed: ${error.message}`);
    logger.warn('Starting server without database connectivity. Only non-db routes will work.');
  }

  // Start server regardless of DB connection state
  const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}${dbConnected ? '' : ' (DB not connected)'}`);
  });

  // Handle shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });
  });
};

startServer();
