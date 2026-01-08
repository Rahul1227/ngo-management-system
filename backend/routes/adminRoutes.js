const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllRegistrations,
  getAllDonations,
  exportRegistrations,
  exportDonations
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');

// All routes are protected and for admins only
router.get('/dashboard', protect, checkRole('admin'), getDashboardStats);
router.get('/registrations', protect, checkRole('admin'), getAllRegistrations);
router.get('/donations', protect, checkRole('admin'), getAllDonations);
router.get('/export/registrations', protect, checkRole('admin'), exportRegistrations);
router.get('/export/donations', protect, checkRole('admin'), exportDonations);

module.exports = router;
