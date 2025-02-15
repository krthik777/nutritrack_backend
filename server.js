require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let db;

(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db('NutriTrack_db');
    await db.collection('profile').createIndex({ email: 1 }, { unique: true });
    console.log("Unique index created on email field in profile collection");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit if DB connection fails
  }
})();

// Import routes
const allergensRoutes = require('./routes/allergens');
const mealPlannerRoutes = require('./routes/mealPlanner');
const profileRoutes = require('./routes/profile');

// Use routes
app.use('/api/allergens', allergensRoutes(db));
app.use('/api/mealPlanner', mealPlannerRoutes(db));
app.use('/api/profile', profileRoutes(db));

// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
