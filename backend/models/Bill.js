const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  parsedData: {
    merchantName: String,
    totalAmount: Number,
    date: Date,
    items: [{
      description: String,
      amount: Number,
      category: String
    }],
    rawText: String,
    confidence: Number
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: 'pending'
  },
  expenseCreated: {
    type: Boolean,
    default: false
  },
  expenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Bill', billSchema);