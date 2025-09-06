const mongoose = require('mongoose');
require('dotenv').config(); // This should be at the VERY top
const dotenv = require("dotenv");
 

dotenv.config({ path: "./config.env" });
const Movie = require('./models/Movie'); // Adjust path if needed
const DB = process.env.DATABASE_URL;

// Check if DB connection string is available
if (!DB) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set.');
  console.error('Please make sure you have a .env file with DATABASE_URL=your_connection_string');
  process.exit(1); // Exit the script with error code
}

async function migrateAddFields() {
  try {
    // 1. Connect to your MongoDB
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully...');

    // 2. Update all existing documents that lack the new fields
    console.log('Starting migration...');
    const result = await Movie.updateMany(
      {
        $or: [
          { completed: { $exists: false } },
          { percentage: { $exists: false } }
        ]
      },
      {
        $set: {
          completed: true, // Set default value for existing docs
          percentage: 0     // Set default value for existing docs
        }
      }
    );

    console.log(`✅ Migration successful! Updated ${result.modifiedCount} documents.`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('Please check the path to your Movie model:', error.path);
    }
  } finally {
    // 3. Close the connection
    if (mongoose.connection.readyState !== 0) { // Check if connection is open
      await mongoose.connection.close();
      console.log('Database connection closed.');
    }
    process.exit(0); // Exit the script
  }
}

// Run the migration
migrateAddFields();