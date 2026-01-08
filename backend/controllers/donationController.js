const Donation = require('../models/Donation');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay (we'll add keys later)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_secret'
});

// @desc    Create donation and Razorpay order
// @route   POST /api/donations/create
// @access  Private
const createDonation = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be at least ₹1'
      });
    }

    // Create donation record with status 'pending' BEFORE payment
    const donation = await Donation.create({
      userId: req.user.id,
      amount,
      paymentStatus: 'pending'
    });

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `receipt_${donation._id}`
    };

    const order = await razorpay.orders.create(options);

    // Update donation with Razorpay order ID
    donation.razorpayOrderId = order.id;
    await donation.save();

    res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      donation,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency
      }
    });

  } catch (error) {
    console.error('Create donation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while creating donation'
    });
  }
};

// @desc    Verify payment after Razorpay redirect
// @route   POST /api/donations/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Find donation by order ID
    const donation = await Donation.findOne({ razorpayOrderId: razorpay_order_id });

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'test_secret')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment successful - update donation
      donation.paymentStatus = 'success';
      donation.razorpayPaymentId = razorpay_payment_id;
      donation.razorpaySignature = razorpay_signature;
      donation.completedAt = new Date();
      await donation.save();

      return res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        donation
      });
    } else {
      // Signature mismatch - mark as failed
      donation.paymentStatus = 'failed';
      donation.failureReason = 'Signature verification failed';
      await donation.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        donation
      });
    }

  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during payment verification'
    });
  }
};

// @desc    Razorpay webhook handler
// @route   POST /api/donations/webhook
// @access  Public (but verified by Razorpay signature)
const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const shasum = crypto.createHmac('sha256', secret || 'test_webhook');
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
      // Webhook is valid
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;

      if (event === 'payment.captured') {
        // Update donation status
        await Donation.findOneAndUpdate(
          { razorpayOrderId: paymentEntity.order_id },
          {
            paymentStatus: 'success',
            razorpayPaymentId: paymentEntity.id,
            completedAt: new Date()
          }
        );
      } else if (event === 'payment.failed') {
        // Update donation as failed
        await Donation.findOneAndUpdate(
          { razorpayOrderId: paymentEntity.order_id },
          {
            paymentStatus: 'failed',
            failureReason: paymentEntity.error_description || 'Payment failed'
          }
        );
      }

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid signature' });
    }

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing error'
    });
  }
};

module.exports = {
  createDonation,
  verifyPayment,
  handleWebhook
};