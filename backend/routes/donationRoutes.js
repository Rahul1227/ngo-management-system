const express = require('express');
const router = express.Router();
const { 
  createDonation, 
  verifyPayment, 
  handleWebhook 
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

// Protected routes
router.post('/create', protect, createDonation);
router.post('/verify', protect, verifyPayment);

// Public route for Razorpay webhook
router.post('/webhook', handleWebhook);

module.exports = router;