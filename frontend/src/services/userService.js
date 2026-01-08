import api from './api';

export const userService = {
  getProfile: async () => {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  getDonations: async () => {
    const response = await api.get('/api/user/donations');
    return response.data;
  },
};