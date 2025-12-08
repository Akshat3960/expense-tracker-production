const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const auth = require('../middleware/auth');

// Get all incomes
router.get('/', auth, async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add income
router.post('/', auth, async (req, res) => {
  try {
    const newIncome = new Income({
      userId: req.user.id,
      ...req.body
    });
    
    const income = await newIncome.save();
    res.json(income);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete income
router.delete('/:id', auth, async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    
    if (!income) {
      return res.status(404).json({ msg: 'Income not found' });
    }
    
    if (income.userId.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await Income.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Income removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;