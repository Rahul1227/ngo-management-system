import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService } from "../../services/userService";
import Card from "../common/Card";
import Loader from "../common/Loader";

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
      setDonations(response.donations || []);
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ONLY CHANGE: normalize pending -> failed
  const getDisplayStatus = (status) => {
    return status === "pending" ? "failed" : status;
  };

  const getStatusBadge = (status) => {
    const badges = {
      success: "badge-success",
      failed: "badge-failed",
    };
    return badges[status] || "badge-failed";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <p className="text-sm text-gray-600">Total Attempts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalAttempts}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {stats.successfulDonations}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {stats.pendingDonations}
              </p>
            </Card>
            <Card className="text-center">
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{stats.totalAmount}
              </p>
            </Card>
          </div>
        )}

        {donations.length === 0 ? (
          <Card className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No donations yet
            </h3>
            <Link to="/user/donate" className="btn btn-primary">
              Make a Donation
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => {
              const status = getDisplayStatus(donation.paymentStatus);

              return (
                <Card key={donation._id} hover={false}>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          ₹{donation.amount}
                        </span>
                        <span className={`badge ${getStatusBadge(status)}`}>
                          {status}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600">
                        Attempted: {formatDate(donation.attemptedAt)}
                      </div>
                    </div>

                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {status === "success" && (
                        <div className="p-3 bg-green-100 rounded-full">
                          <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}

                      {status === "failed" && (
                        <div className="p-3 bg-red-100 rounded-full">
                          <svg
                            className="w-6 h-6 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/user/dashboard" className="btn btn-outline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
