import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const combatService = {
  startCombat: async (opponentId) => {
    try {
      const response = await api.post('/auth/combat/start', { opponentId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar combate' };
    }
  },

  getCombatHistory: async () => {
    try {
      const response = await api.get('/auth/combat/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener historial' };
    }
  }
};

export default combatService;
