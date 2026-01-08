import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { donationService } from '../../services/donationService';
import Card from '../common/Card';
import Button from '../common/Button';

const DonationForm = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!amount || amount < 1) {
      setError('Please enter a valid amount (minimum ₹1)');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const res = await loadRazorpay();
      if (!res) {
        setError('Razorpay SDK failed to load. Please check your connection.');
        setLoading(false);
        return;
      }

      // Create donation
      const response = await donationService.createDonation({ amount: parseFloat(amount) });
      
      if (response.success) {
        const { order, donation } = response.data;

        // Razorpay options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Aarambh',
          description: 'Support our cause',
          order_id: order.id,
          handler: async (razorpayResponse) => {
            try {
              // Verify payment
              await donationService.verifyPayment({
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
              });

              alert('Payment successful! Thank you for your donation.');
              navigate('/user/history');
            } catch (error) {
              console.error('Payment verification failed:', error);
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: '',
            email: '',
          },
          theme: {
            color: '#f97316',
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              alert('Payment cancelled');
            },
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
        setLoading(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create donation');
      setLoading(false);
    }
  };

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto container-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Make a Donation
          </h1>
          <p className="text-gray-600 mt-2">
            Your contribution helps us make a difference
          </p>
        </div>

        <Card>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Quick Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt.toString())}
                    className={`py-3 px-4 rounded-lg border-2 transition-all ${
                      amount === amt.toString()
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <input
                  id="amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input !pl-10"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Minimum donation: ₹1
              </p>
            </div>

            {/* Payment Info */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💳 You will be redirected to Razorpay for secure payment processing.
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
            >
              Proceed to Payment
            </Button>
          </form>
        </Card>

        {/* Info Section */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>All donations are secure and encrypted.</p>
          <p className="mt-1">You will receive a confirmation after successful payment.</p>
        </div>
      </div>
    </div>
  );
};

export default DonationForm;