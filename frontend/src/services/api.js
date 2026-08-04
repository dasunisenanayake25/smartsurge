import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Request interceptor to attach JWT Token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;