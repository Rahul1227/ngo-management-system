import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Button from '../common/Button';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState({
    paymentStatus: '',
  });

  // NEW STATE (logic only)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, [filters, page]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = await adminService.getDonations({
        ...filters,
        page,
      });

      setDonations(prev =>
        page === 1 ? response.donations : [...prev, ...response.donations]
      );

      // backend sends 10 per page
      if (response.donations.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportDonations();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export donations');
    } finally {
      setExporting(false);
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

  if (loading && donations.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading donations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              All Donations
            </h1>
            <p className="text-gray-600 mt-2">
              {donations.length} donation(s) loaded
            </p>
          </div>
          <Button
            onClick={handleExport}
            loading={exporting}
            variant="secondary"
          >
            📥 Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => {
                setPage(1);
                setHasMore(true);
                setDonations([]);
                setFilters({ paymentStatus: e.target.value });
              }}
              className="input max-w-xs"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </Card>

        {/* Donations Table */}
        {donations.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">No donations found</p>
          </Card>
        ) : (
          <>
            <Card className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Attempted</th>
                    <th className="text-left py-3 px-4">Completed</th>
                    <th className="text-left py-3 px-4">Payment ID</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((donation) => (
                    <tr
                      key={donation._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium">
                          {donation.userId?.fullName || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {donation.userId?.email || 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        ₹{donation.amount}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge ${getStatusBadge(donation.paymentStatus)}`}>
                          {donation.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(donation.attemptedAt)}
                      </td>
                      <td className="py-3 px-4">
                        {donation.completedAt
                          ? formatDate(donation.completedAt)
                          : '-'}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs">
                        {donation.razorpayPaymentId || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Load More */}
            {hasMore && (
              <div className="mt-6 text-center">
                <Button
                  onClick={() => setPage(p => p + 1)}
                  loading={loading}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DonationList;
