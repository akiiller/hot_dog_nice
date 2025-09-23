const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET todos os produtos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products); // retorna array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST novo produto
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;