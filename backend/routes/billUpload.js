const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const auth = require('../middleware/auth');
const Bill = require('../models/Bill');
const Expense = require('../models/Expense');
const billParser = require('../utils/billParser');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'expense-tracker/bills',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 2000, height: 2000, crop: 'limit', quality: 'auto' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'));
    }
  }
});

// Upload and parse bill
router.post('/upload', auth, upload.single('bill'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'No file uploaded' 
      });
    }

    console.log('File uploaded to Cloudinary:', req.file.path);

    // Create bill record with Cloudinary URL
    const bill = new Bill({
      userId: req.user.id,
      imageUrl: req.file.path, // Cloudinary URL
      status: 'pending'
    });

    await bill.save();

    // Process image in background
    processImage(bill._id, req.file.path, req.user.id);

    res.json({
      success: true,
      message: 'Bill uploaded successfully. Processing...',
      billId: bill._id,
      imageUrl: req.file.path
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error uploading bill' 
    });
  }
});

// Background processing function
async function processImage(billId, imageUrl, userId) {
  try {
    console.log('Starting bill processing for:', billId);

    // Parse bill (billParser can work with URLs)
    const parsedData = await billParser.parseBill(imageUrl);

    // Update bill record
    await Bill.findByIdAndUpdate(billId, {
      parsedData,
      status: 'processed'
    });

    console.log('Bill processed successfully:', billId);

  } catch (error) {
    console.error('Processing error:', error);
    await Bill.findByIdAndUpdate(billId, {
      status: 'failed',
      error: error.message
    });
  }
}

// Get bill parsing status
router.get('/status/:billId', auth, async (req, res) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.billId,
      userId: req.user.id
    });

    if (!bill) {
      return res.status(404).json({ 
        success: false,
        message: 'Bill not found' 
      });
    }

    res.json({
      success: true,
      ...bill.toObject()
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error checking status' 
    });
  }
});

// Get all user's bills
router.get('/history', auth, async (req, res) => {
  try {
    const bills = await Bill.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      count: bills.length,
      bills
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching bills' 
    });
  }
});

// Create expense from parsed bill
router.post('/create-expense/:billId', auth, async (req, res) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.billId,
      userId: req.user.id
    });

    if (!bill) {
      return res.status(404).json({ 
        success: false,
        message: 'Bill not found' 
      });
    }

    if (bill.status !== 'processed') {
      return res.status(400).json({ 
        success: false,
        message: 'Bill not yet processed' 
      });
    }

    if (bill.expenseCreated) {
      return res.status(400).json({ 
        success: false,
        message: 'Expense already created for this bill' 
      });
    }

    const { parsedData } = bill;
    const { customCategory, customAmount, customDate, customTitle } = req.body;

    // Create expense from parsed data
    const expense = new Expense({
      userId: req.user.id,
      title: customTitle || parsedData.merchantName || 'Bill Payment',
      amount: customAmount || parsedData.totalAmount || 0,
      category: customCategory || 'Other',
      description: `Auto-created from bill scan. Merchant: ${parsedData.merchantName || 'Unknown'}`,
      date: customDate || parsedData.date || new Date()
    });

    await expense.save();

    // Update bill record
    bill.expenseCreated = true;
    bill.expenseId = expense._id;
    await bill.save();

    res.json({
      success: true,
      message: 'Expense created successfully',
      expense
    });

  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating expense' 
    });
  }
});

// Delete bill
router.delete('/:billId', auth, async (req, res) => {
  try {
    const bill = await Bill.findOne({
      _id: req.params.billId,
      userId: req.user.id
    });

    if (!bill) {
      return res.status(404).json({ 
        success: false,
        message: 'Bill not found' 
      });
    }

    // Delete from Cloudinary
    if (bill.imageUrl) {
      try {
        const publicId = bill.imageUrl.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
        console.log('Image deleted from Cloudinary:', publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }
    }

    // Delete bill record
    await Bill.findByIdAndDelete(req.params.billId);

    res.json({ 
      success: true,
      message: 'Bill deleted successfully' 
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error deleting bill' 
    });
  }
});

module.exports = router;