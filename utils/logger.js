// logger.js
import winston from 'winston';
import mongoose from 'mongoose';
import Log from './models/logModel.js';

class MongoDBTransport extends winston.TransportStreamOptions {
  log(info, callback) {
    // Save the log to the MongoDB collection
    Log.create({
      timestamp: info.timestamp,
      level: info.level,
      message: info.message,
      details: info.details
    }).then(() => callback()).catch(err => console.error('Error saving log to MongoDB:', err));

    // Ensure callback is called
    if (callback) callback();
  }
}

// Create the logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new MongoDBTransport({ collection: 'logs' }),
    new winston.transports.File({ filename: 'logs/application.log' })
  ]
});

export { logger };
