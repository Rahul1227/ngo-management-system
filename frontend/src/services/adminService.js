import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  },

  getRegistrations: async (params = {}) => {
    const response = await api.get('/api/admin/registrations', { params });
    return response.data;
  },

  getDonations: async (params = {}) => {
    const response = await api.get('/api/admin/donations', { params });
    return response.data;
  },

  exportRegistrations: async () => {
    const response = await api.get('/api/admin/export/registrations', {
      responseType: 'blob',
    });
    return response.data;
  },

  exportDonations: async () => {
    const response = await api.get('/api/admin/export/donations', {
      responseType: 'blob',
    });
    return response.data;
  },
};