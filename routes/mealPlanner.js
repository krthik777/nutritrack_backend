module.exports = (db) => {
    const express = require('express');
    const router = express.Router();
  
    // Get meal plans by email
    router.get('/', async (req, res) => {
      const { email } = req.query;
      try {
        if (!email) {
          return res.status(400).json({ message: "Email is required to fetch meal plans." });
        }
        const meals = await db.collection('mealPlanner').find({ email }).toArray();
        res.json(meals);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  
    // Add a new meal plan
    router.post('/', async (req, res) => {
      try {
        const meal = req.body;
        if (!meal.email) {
          return res.status(400).json({ message: "Email is required." });
        }
        await db.collection('mealPlanner').insertOne(meal);
        res.status(201).json(meal);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  
    return router;
  };
  