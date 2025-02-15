module.exports = (db) => {
    const express = require('express');
    const router = express.Router();
  
    // Get profile by email
    router.get('/', async (req, res) => {
      const { email } = req.query;
      try {
        if (!email) {
          return res.status(400).json({ message: "Email is required." });
        }
        const profile = await db.collection('profile').findOne({ email });
        if (!profile) {
          return res.status(404).json({ message: "Profile not found." });
        }
        res.json(profile);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  
    // Create or update profile
    router.post('/', async (req, res) => {
      try {
        const profile = req.body;
        if (!profile.email) {
          return res.status(400).json({ message: "Email is required." });
        }
  
        await db.collection('profile').replaceOne(
          { email: profile.email },
          profile,
          { upsert: true }
        );
  
        res.status(201).json(profile);
      } catch (error) {
        if (error.code === 11000) {
          res.status(409).json({ message: "A profile with this email already exists." });
        } else {
          res.status(400).json({ message: error.message });
        }
      }
    });
  
    return router;
  };
  