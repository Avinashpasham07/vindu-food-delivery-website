const mongoose = require('mongoose');
const logger = require('../config/logger');

function connectDB() {
    mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 50, // Maintain up to 50 socket connections
        minPoolSize: 10, // Maintain at least 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
        .then(() => {
            logger.info('Connected to MongoDB');
        })
        .catch((err) => {
            logger.error(`Error connecting to MongoDB: ${err.message}`);
        })
}
module.exports = connectDB;