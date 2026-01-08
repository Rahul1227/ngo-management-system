const express = require('express');
const router = express.Router();
const { getUserProfile, getUserDonations } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// All routes are protected and for users only
router.get('/profile', protect, checkRole('user'), getUserProfile);
router.get('/donations', protect, checkRole('user'), getUserDonations);

module.exports = router;