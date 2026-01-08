import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Card from '../common/Card';
import Loader from '../common/Loader';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            My Profile
          </h1>
          <p className="text-gray-600 mt-2">
            View your account information
          </p>
        </div>

        {/* User Information */}
        <Card className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Full Name
              </label>
              <p className="text-lg text-gray-900 font-medium">
                {profile?.user?.fullName || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email Address
              </label>
              <p className="text-lg text-gray-900 font-medium">
                {profile?.user?.email || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Phone Number
              </label>
              <p className="text-lg text-gray-900 font-medium">
                {profile?.user?.phone || 'Not provided'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Account Type
              </label>
              <span className={`badge ${profile?.user?.role === 'admin' ? 'badge-pending' : 'badge-success'}`}>
                {profile?.user?.role || 'user'}
              </span>
            </div>
          </div>
        </Card>

        {/* Registration Details */}
        {profile?.registration && (
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Registration Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Registration Date
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {formatDate(profile.registration.registrationDate)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Cause
                </label>
                <p className="text-lg text-gray-900 font-medium">
                  {profile.registration.causeName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Status
                </label>
                <span className={`badge ${profile.registration.status === 'active' ? 'badge-success' : 'badge-failed'}`}>
                  {profile.registration.status}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Registration ID
                </label>
                <p className="text-sm text-gray-900 font-mono">
                  {profile.registration._id}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserProfile;