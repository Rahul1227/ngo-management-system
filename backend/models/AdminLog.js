const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: [
      'VIEW_REGISTRATIONS',
      'EXPORT_REGISTRATIONS',
      'VIEW_DONATIONS',
      'EXPORT_DONATIONS',
      'VIEW_DASHBOARD',
      'FILTER_APPLIED'
    ]
  },
  actionDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
adminLogSchema.index({ adminId: 1 });
adminLogSchema.index({ timestamp: -1 });

module.exports = mongoose.model('AdminLog', adminLogSchema);

