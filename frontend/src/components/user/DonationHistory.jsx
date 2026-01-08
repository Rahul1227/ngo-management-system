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
      console.log("Full response:", response); // Keep for now

      // The response IS the data (userService already returns response.data)
      setDonations(response.donations || []);
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      success: "badge-success",
      pending: "badge-pending",
      failed: "badge-failed",
    };
    return badges[status] || "badge-pending";
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

        {/* Stats Summary */}
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
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
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

        {/* Donations List */}
        {donations.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No donations yet
            </h3>
            <p className="text-gray-600 mb-4">
              Make your first donation to support our cause
            </p>
            <Link to="/user/donate" className="btn btn-primary">
              Make a Donation
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation._id} hover={false}>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{donation.amount}
                      </span>
                      <span
                        className={`badge ${getStatusBadge(
                          donation.paymentStatus
                        )}`}
                      >
                        {donation.paymentStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium text-gray-700">
                          Attempted:
                        </span>{" "}
                        {formatDate(donation.attemptedAt)}
                      </div>

                      {donation.completedAt && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Completed:
                          </span>{" "}
                          {formatDate(donation.completedAt)}
                        </div>
                      )}

                      {donation.razorpayOrderId && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Order ID:
                          </span>{" "}
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {donation.razorpayOrderId}
                          </span>
                        </div>
                      )}

                      {donation.razorpayPaymentId && (
                        <div>
                          <span className="font-medium text-gray-700">
                            Payment ID:
                          </span>{" "}
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {donation.razorpayPaymentId}
                          </span>
                        </div>
                      )}

                      {donation.failureReason && (
                        <div className="col-span-2">
                          <span className="font-medium text-red-700">
                            Failure Reason:
                          </span>{" "}
                          <span className="text-red-600">
                            {donation.failureReason}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex-shrink-0">
                    {donation.paymentStatus === "success" && (
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
                    {donation.paymentStatus === "pending" && (
                      <div className="p-3 bg-yellow-100 rounded-full">
                        <svg
                          className="w-6 h-6 text-yellow-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    )}
                    {donation.paymentStatus === "failed" && (
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
            ))}
          </div>
        )}

        {/* Back to Dashboard */}
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
