import axios from 'axios';

const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_URL}/api`
});

// Agregar token a las peticiones
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

export const authService = {
  register: async (username, email, password, characterName) => {
    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        characterName
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('player', JSON.stringify(response.data.player));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al registrarse' };
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('player', JSON.stringify(response.data.player));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al iniciar sesión' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('player');
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener perfil' };
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getCurrentPlayer: () => {
    const player = localStorage.getItem('player');
    return player ? JSON.parse(player) : null;
  }
};

export default authService;
