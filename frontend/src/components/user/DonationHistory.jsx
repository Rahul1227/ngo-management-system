import { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import Card from '../common/Card';
import Loader from '../common/Loader';

const DonationHistory = () => {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await userService.getDonations();
      setDonations(response.data.donations);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      success: 'badge-success',
      pending: 'badge-pending',
      failed: 'badge-failed',
    };
    return badges[status] || 'badge-pending';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading donations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Donation History
          </h1>
          <p className="text-gray-600 mt-2">
            View all your past donation attempts
          </p>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <p className="text-sm text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalAttempts}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.successfulDonations}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pendingDonations}</p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">₹{stats.totalAmount}</p>
            </Card>
          </div>
        )}

        {/* Donations List */}
        {donations.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No donations yet</h3>
            <p className="text-gray-600 mb-4">Make your first donation to support our cause</p>
            <a href="/user/donate" className="btn btn-primary">
              Make a Donation
            </a>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation._id} hover={false}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{donation.amount}
                      </span>
                      <span className={`badge ${getStatusBadge(donation.paymentStatus)}`}>
                        {donation.paymentStatus}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Attempted:</span>{' '}
                        {formatDate(donation.attemptedAt)}
                      </p>
                      {donation.completedAt && (
                        <p>
                          <span className="font-medium">Completed:</span>{' '}
                          {formatDate(donation.completedAt)}
                        </p>
                      )}
                      {donation.razorpayOrderId && (
                        <p>
                          <span className="font-medium">Order ID:</span>{' '}
                          <span className="font-mono text-xs">{donation.razorpayOrderId}</span>
                        </p>
                      )}
                      {donation.razorpayPaymentId && (
                        <p>
                          <span className="font-medium">Payment ID:</span>{' '}
                          <span className="font-mono text-xs">{donation.razorpayPaymentId}</span>
                        </p>
                      )}
                      {donation.failureReason && (
                        <p className="text-red-600">
                          <span className="font-medium">Reason:</span> {donation.failureReason}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;