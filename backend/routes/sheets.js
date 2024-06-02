const express = require('express');
const router = express.Router();
const Sheet = require('../models/sheetModel');

// Get all sheets
router.get('/sheetCollection', async (req, res) => {
  try {
    const sheets = await Sheet.find();
    res.json(sheets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
