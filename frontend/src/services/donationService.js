import api from './api';

export const donationService = {
  createDonation: async (data) => {
    const response = await api.post('/api/donations/create', data);
    return response.data;
  },

  verifyPayment: async (data) => {
    const response = await api.post('/api/donations/verify', data);
    return response.data;
  },
};