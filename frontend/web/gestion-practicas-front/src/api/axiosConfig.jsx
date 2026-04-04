import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8088/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Por si en el futuro necesitas añadir tokens de autenticación
api.interceptors.request.use(
  (config) => {
    // Aquí podrías añadir el token si lo guardas en localStorage
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;