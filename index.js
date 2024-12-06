const express = require('express');
const { ObjectId } = require('mongodb');
const connectDB = require('./db'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

(async () => {
  const db = await connectDB();
  const usersCollection = db.collection('users'); // Reference the 'users' collection

  // Route to get all users
  app.get('/api/users', async (req, res) => {
    try {
      const users = await usersCollection.find({}).toArray(); // Fetch all documents
      res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Route to get a user by ID
  app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Route to POST a new user (name, sex, gender)
  app.post('/api/users', async (req, res) => {
    const { name, sex, gender } = req.body;

    // Validate input
    if (!name || !sex || !gender) {
      return res.status(400).json({ message: 'All fields (name, sex, gender) are required.' });
    }

    try {
      const newUser = { name, sex, gender };
      
      // Insert the new user into the 'users' collection
      const result = await usersCollection.insertOne(newUser);
      
      res.status(201).json({
        message: 'User created successfully',
        user: { _id: result.insertedId, ...newUser },
      });
    } catch (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
})();
