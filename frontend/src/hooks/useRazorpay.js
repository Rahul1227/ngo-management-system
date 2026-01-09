import { useState, useEffect } from 'react';
import { createDonation, verifyPayment } from '../services/donationService';
import useAuth from './useAuth';

/**
 * Custom hook for Razorpay integration
 * Handles payment modal, verification, and callbacks
 */
const useRazorpay = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        // Check if script already exists
        if (document.getElementById('razorpay-script')) {
          setIsScriptLoaded(true);
          resolve(true);
          return;
        }

        const script = document.createElement('script');
        script.id = 'razorpay-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setIsScriptLoaded(true);
          resolve(true);
        };
        script.onerror = () => {
          setIsScriptLoaded(false);
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, []);

  /**
   * Open Razorpay payment modal
   * @param {number} amount - Amount to be donated
   * @param {function} onSuccess - Callback on successful payment
   * @param {function} onFailure - Callback on failed payment
   */
  const openPaymentModal = async (amount, onSuccess, onFailure) => {
    if (!isScriptLoaded) {
      alert('Payment system is loading. Please try again.');
      return;
    }

    if (!window.Razorpay) {
      alert('Payment system failed to load. Please refresh the page.');
      return;
    }

    setIsLoading(true);

    try {
      // Step 1: Create donation and get Razorpay order
      const response = await createDonation({ amount });
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to create donation');
      }

      const { donation, order } = response;

      // Step 2: Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Aarambh',
        description: 'Donation to support the cause',
        image: '/assets/images/logo.png',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.success) {
              onSuccess && onSuccess(verifyResponse.donation);
            } else {
              onFailure && onFailure('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            onFailure && onFailure(error.message || 'Payment verification failed');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: {
          donation_id: donation._id
        },
        theme: {
          color: '#f97316' // Primary color
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            onFailure && onFailure('Payment cancelled by user');
          }
        }
      };

      // Step 4: Open Razorpay modal
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        setIsLoading(false);
        onFailure && onFailure(response.error.description || 'Payment failed');
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      setIsLoading(false);
      onFailure && onFailure(error.message || 'Failed to initiate payment');
    }
  };

  return {
    openPaymentModal,
    isLoading,
    isScriptLoaded
  };
};

export default useRazorpay;