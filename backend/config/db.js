const mongoose = require('mongoose');
const dns = require('dns');

// Use Google Public DNS for SRV record resolution.
// Many ISP DNS servers cannot resolve MongoDB Atlas SRV records.
dns.setServers(['8.8.8.8', '8.8.4.4']);

/**
 * Connect to MongoDB using the MONGO_URI from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
