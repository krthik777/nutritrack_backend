module.exports = (db) => {
    const express = require('express');
    const router = express.Router();
  
    // Get allergens by email
    router.get('/', async (req, res) => {
      const { email } = req.query;
      try {
        if (!email) {
          return res.status(400).json({ message: "Email is required to fetch allergens." });
        }
        const allergens = await db.collection('allergens').find({ email }).toArray();
        res.json(allergens);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  
    // Add a new allergen
    router.post('/', async (req, res) => {
      try {
        const allergen = req.body;
        if (!allergen.email) {
          return res.status(400).json({ message: "Email is required." });
        }
        await db.collection('allergens').insertOne(allergen);
        res.status(201).json(allergen);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
  
    return router;
  };
  