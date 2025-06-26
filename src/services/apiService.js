import axios from 'axios';

const API_BASE_URL = 'https://api.framework.ge/martvis/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  getVehicles: async () => {
    const response = await apiClient.get('', { params: { get: 'vehicles' } });
    return response.data;
  },

  getCategories: async (lang = 'en') => {
    const response = await apiClient.get('', { params: { get: 'categories', lang } });
    return response.data;
  },

  getLanguages: async () => {
    const response = await apiClient.get('', { params: { get: 'languages' } });
    return response.data;
  },

  getTickets: async (vehicleType, category = null, lang = 'en') => {
    const params = { get: 'tickets', vehicle_type: vehicleType, lang };
    if (category) {
      params.category = category;
    }
    const response = await apiClient.get('', { params });
    return response.data;
  },

  getExam: async (vehicleType, lang = 'en') => {
    const response = await apiClient.get('', { 
      params: { 
        get: 'exam', 
        vehicle_type: vehicleType, 
        lang 
      }
    });
    return response.data;
  },
}; 