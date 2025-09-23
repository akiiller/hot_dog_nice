const express = require('express');
const router = express.Router();
const ProductRecipe = require('../models/ProductRecipe');

// GET todas as receitas de produto
router.get('/', async (req, res) => {
  try {
    const recipes = await ProductRecipe.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST nova receita de produto
router.post('/', async (req, res) => {
  try {
    const recipe = new ProductRecipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;