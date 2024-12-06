require('dotenv').config(); // Load .env variables
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI; // Use Mongo URI from environment variable
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('test'); // Use the correct database name 'test'
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
}

module.exports = connectDB;
