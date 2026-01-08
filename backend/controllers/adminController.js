const User = require('../models/User');
const Registration = require('../models/Registration');
const Donation = require('../models/Donation');
const AdminLog = require('../models/AdminLog');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // Log admin action
    await AdminLog.create({
      adminId: req.user.id,
      actionType: 'VIEW_DASHBOARD',
      actionDetails: { timestamp: new Date() }
    });

    // Get statistics
    const totalRegistrations = await Registration.countDocuments();
    const totalDonations = await Donation.countDocuments();
    
    const successfulDonations = await Donation.find({ paymentStatus: 'success' });
    const totalAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
    
    const pendingDonations = await Donation.countDocuments({ paymentStatus: 'pending' });
    const failedDonations = await Donation.countDocuments({ paymentStatus: 'failed' });

    res.status(200).json({
      success: true,
      stats: {
        totalRegistrations,
        totalDonations,
        successfulDonations: successfulDonations.length,
        totalAmount,
        pendingDonations,
        failedDonations
      }
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all registrations with filters
// @route   GET /api/admin/registrations
// @access  Private/Admin
const getAllRegistrations = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    
    if (status) {
      query.status = status;
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user.id,
      actionType: 'VIEW_REGISTRATIONS',
      actionDetails: { filters: req.query }
    });

    // Get registrations with user details
    const registrations = await Registration.find(query)
      .populate('userId', 'fullName email phone')
      .sort({ registrationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Registration.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      registrations
    });

  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all donations with filters
// @route   GET /api/admin/donations
// @access  Private/Admin
const getAllDonations = async (req, res) => {
  try {
    const { paymentStatus, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Log admin action
    await AdminLog.create({
      adminId: req.user.id,
      actionType: 'VIEW_DONATIONS',
      actionDetails: { filters: req.query }
    });

    // Get donations with user details
    const donations = await Donation.find(query)
      .populate('userId', 'fullName email phone')
      .sort({ attemptedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Donation.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      donations
    });

  } catch (error) {
    console.error('Get donations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Export registrations as CSV
// @route   GET /api/admin/export/registrations
// @access  Private/Admin
const exportRegistrations = async (req, res) => {
  try {
    // Log admin action
    await AdminLog.create({
      adminId: req.user.id,
      actionType: 'EXPORT_REGISTRATIONS',
      actionDetails: { timestamp: new Date() }
    });

    const registrations = await Registration.find()
      .populate('userId', 'fullName email phone')
      .sort({ registrationDate: -1 });

    // Create CSV content
    let csv = 'Full Name,Email,Phone,Registration Date,Status\n';
    
    registrations.forEach(reg => {
      const user = reg.userId;
      csv += `${user.fullName},${user.email},${user.phone || 'N/A'},${reg.registrationDate},${reg.status}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
    res.status(200).send(csv);

  } catch (error) {
    console.error('Export registrations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Export donations as CSV
// @route   GET /api/admin/export/donations
// @access  Private/Admin
const exportDonations = async (req, res) => {
  try {
    // Log admin action
    await AdminLog.create({
      adminId: req.user.id,
      actionType: 'EXPORT_DONATIONS',
      actionDetails: { timestamp: new Date() }
    });

    const donations = await Donation.find()
      .populate('userId', 'fullName email phone')
      .sort({ attemptedAt: -1 });

    // Create CSV content
    let csv = 'Full Name,Email,Amount,Status,Attempted At,Completed At,Payment ID\n';
    
    donations.forEach(donation => {
      const user = donation.userId;
      csv += `${user.fullName},${user.email},${donation.amount},${donation.paymentStatus},${donation.attemptedAt},${donation.completedAt || 'N/A'},${donation.razorpayPaymentId || 'N/A'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=donations.csv');
    res.status(200).send(csv);

  } catch (error) {
    console.error('Export donations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllRegistrations,
  getAllDonations,
  exportRegistrations,
  exportDonations
};
