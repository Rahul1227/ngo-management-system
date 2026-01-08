import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Loader from '../common/Loader';
import Card from '../common/Card';

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, donationsRes] = await Promise.all([
        userService.getProfile(),
        userService.getDonations(),
      ]);

      setProfile(profileRes.data);
      setStats(donationsRes.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Welcome back, {user.fullName}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your contributions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalAttempts || 0}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-lg">
                <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Successful</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.successfulDonations || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{stats?.totalAmount || 0}
                </p>
              </div>
              <div className="p-3 bg-secondary-100 rounded-lg">
                <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer" hover={false}>
            <Link to="/user/donate" className="block">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Make a Donation</h3>
                  <p className="text-sm text-gray-600">Support our cause with your contribution</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer" hover={false}>
            <Link to="/user/history" className="block">
              <div className="flex items-center space-x-4">
                <div className="p-4 bg-secondary-100 rounded-full">
                  <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Donation History</h3>
                  <p className="text-sm text-gray-600">View all your past donations</p>
                </div>
              </div>
            </Link>
          </Card>
        </div>

        {/* Registration Info */}
        {profile?.registration && (
          <Card className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Registered On</p>
                <p className="font-medium text-gray-900">
                  {new Date(profile.registration.registrationDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Cause</p>
                <p className="font-medium text-gray-900">{profile.registration.causeName}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <span className={`badge ${profile.registration.status === 'active' ? 'badge-success' : 'badge-failed'}`}>
                  {profile.registration.status}
                </span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;