import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Card from '../common/Card';
import Loader from '../common/Loader';
import Button from '../common/Button';

const RegistrationList = () => {
  const [allRegistrations, setAllRegistrations] = useState([]); // All data
  const [filteredRegistrations, setFilteredRegistrations] = useState([]); // Filtered data
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  // Fetch all registrations once
  useEffect(() => {
    fetchRegistrations();
  }, []);

  // Filter whenever filters change (with debouncing for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      filterData();
    }, 300); // Debounce search by 300ms

    return () => clearTimeout(timer);
  }, [filters, allRegistrations]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const response = await adminService.getRegistrations();
      setAllRegistrations(response.registrations);
      setFilteredRegistrations(response.registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...allRegistrations];

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(reg => reg.status === filters.status);
    }

    // Filter by search (name or email)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(reg => {
        const fullName = reg.userId?.fullName?.toLowerCase() || '';
        const email = reg.userId?.email?.toLowerCase() || '';
        return fullName.includes(searchLower) || email.includes(searchLower);
      });
    }

    setFilteredRegistrations(filtered);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportRegistrations();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export registrations');
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading registrations..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">
              All Registrations
            </h1>
            <p className="text-gray-600 mt-2">
              Showing {filteredRegistrations.length} of {allRegistrations.length} registration(s)
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name/Email
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input"
                placeholder="Type to search..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="input"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Registrations Table */}
        {filteredRegistrations.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-600">
              {filters.search || filters.status ? 'No registrations match your filters' : 'No registrations found'}
            </p>
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Registered</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{reg.userId?.fullName || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{reg.userId?.email || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{reg.userId?.phone || 'N/A'}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-gray-600">{formatDate(reg.registrationDate)}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${reg.status === 'active' ? 'badge-success' : 'badge-failed'}`}>
                        {reg.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegistrationList;