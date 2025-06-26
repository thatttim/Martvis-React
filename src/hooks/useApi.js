import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'https://api.framework.ge/martvis/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(API_BASE_URL, { params });
      return response.data;
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVehicles = useCallback(() => {
    return fetchData('', { get: 'vehicles' });
  }, [fetchData]);

  const getCategories = useCallback((lang = 'en') => {
    return fetchData('', { get: 'categories', lang });
  }, [fetchData]);

  const getLanguages = useCallback(() => {
    return fetchData('', { get: 'languages' });
  }, [fetchData]);

  const getTickets = useCallback((vehicleType, category = null, lang = 'en') => {
    const params = { get: 'tickets', vehicle_type: vehicleType, lang };
    if (category) {
      params.category = category;
    }
    return fetchData('', params);
  }, [fetchData]);

  const getExam = useCallback((vehicleType, lang = 'en') => {
    return fetchData('', { 
      get: 'exam', 
      vehicle_type: vehicleType, 
      lang 
    });
  }, [fetchData]);

  return {
    loading,
    error,
    getVehicles,
    getCategories,
    getLanguages,
    getTickets,
    getExam
  };
}; 