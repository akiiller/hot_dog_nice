const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// GET todos os ingredientes
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST novo ingrediente
router.post('/', async (req, res) => {
  try {
    const ingredient = new Ingredient(req.body);
    await ingredient.save();
    res.status(201).json(ingredient);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;