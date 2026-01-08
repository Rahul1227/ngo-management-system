import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Loader from '../common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log('[AdminDashboard] Fetching dashboard stats...');

      // adminService ALREADY returns response.data
      const response = await adminService.getDashboardStats();

      console.log('[AdminDashboard] Raw response:', response);

      if (response && response.stats) {
        setStats(response.stats);
      } else {
        console.error('[AdminDashboard] Stats missing in response');
        setStats(null);
      }
    } catch (error) {
      console.error('[AdminDashboard] Error fetching stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Unable to load dashboard stats.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage registrations and donations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <p className="text-sm text-gray-600 mb-1">Total Registrations</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalRegistrations}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Total Donations</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.totalDonations}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Total Amount</p>
            <p className="text-3xl font-bold text-green-600">
              ₹{stats.totalAmount}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Successful Donations</p>
            <p className="text-3xl font-bold text-gray-900">
              {stats.successfulDonations}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Pending Donations</p>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.pendingDonations}
            </p>
          </Card>

          <Card>
            <p className="text-sm text-gray-600 mb-1">Failed Donations</p>
            <p className="text-3xl font-bold text-red-600">
              {stats.failedDonations}
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/registrations">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer" hover={false}>
              <h3 className="text-lg font-semibold text-gray-900">
                View Registrations
              </h3>
              <p className="text-sm text-gray-600">
                Manage all user registrations
              </p>
            </Card>
          </Link>

          <Link to="/admin/donations">
            <Card className="hover:shadow-xl transition-shadow cursor-pointer" hover={false}>
              <h3 className="text-lg font-semibold text-gray-900">
                View Donations
              </h3>
              <p className="text-sm text-gray-600">
                Track all donation records
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
