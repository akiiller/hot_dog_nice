const express = require('express');
const router = express.Router();
const SaleItem = require('../models/SaleItem');

// GET todos os itens de venda
router.get('/', async (req, res) => {
  try {
    const items = await SaleItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST novo item de venda
router.post('/', async (req, res) => {
  try {
    const item = new SaleItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;