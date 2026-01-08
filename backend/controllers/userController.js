const User = require('../models/User');
const Registration = require('../models/Registration');
const Donation = require('../models/Donation');

// @desc    Get user profile with registration details
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const registration = await Registration.findOne({ userId: req.user.id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role
      },
      registration: registration || null
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get user's donation history
// @route   GET /api/user/donations
// @access  Private
const getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ userId: req.user.id })
      .sort({ attemptedAt: -1 });

    // Calculate stats
    const totalDonations = donations.length;
    const successfulDonations = donations.filter(d => d.paymentStatus === 'success');
    const totalAmount = successfulDonations.reduce((sum, d) => sum + d.amount, 0);

    res.status(200).json({
      success: true,
      count: totalDonations,
      stats: {
        totalAttempts: totalDonations,
        successfulDonations: successfulDonations.length,
        totalAmount: totalAmount,
        pendingDonations: donations.filter(d => d.paymentStatus === 'pending').length,
        failedDonations: donations.filter(d => d.paymentStatus === 'failed').length
      },
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

module.exports = {
  getUserProfile,
  getUserDonations
};