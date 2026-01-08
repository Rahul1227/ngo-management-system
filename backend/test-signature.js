require('dotenv').config(); // Load .env file
const crypto = require('crypto');

// FROM YOUR .ENV FILE (automatically loaded)
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// FROM THE DONATION YOU JUST CREATED
const order_id = 'order_S1JF99Lv3PTTck'; // Your actual order ID
const payment_id = 'pay_test_123456789'; // Fake payment ID for testing

// Generate signature
const sign = order_id + '|' + payment_id;
const signature = crypto
  .createHmac('sha256', RAZORPAY_KEY_SECRET)
  .update(sign)
  .digest('hex');

console.log('Use these values in Postman:');
console.log('razorpay_order_id:', order_id);
console.log('razorpay_payment_id:', payment_id);
console.log('razorpay_signature:', signature);