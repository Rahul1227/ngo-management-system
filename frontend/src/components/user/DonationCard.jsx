const DonationCard = ({ donation }) => {
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

  return (
    <div className="card">
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
    </div>
  );
};

export default DonationCard;