const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least 1']
  },
  currency: {
    type: String,
    default: 'INR',
    uppercase: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  paymentGateway: {
    type: String,
    default: 'razorpay'
  },
  razorpayOrderId: {
    type: String,
    sparse: true
  },
  razorpayPaymentId: {
    type: String,
    sparse: true
  },
  razorpaySignature: {
    type: String,
    sparse: true
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  failureReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for faster queries
donationSchema.index({ userId: 1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ attemptedAt: -1 });
donationSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Donation', donationSchema);