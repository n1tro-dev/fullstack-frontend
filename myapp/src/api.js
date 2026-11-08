import axios from 'axios';

// 1. Создание экземпляра Axios с базовым URL бэкенда (Глава 10)
const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// 2. Перехватчик запросов (Interceptor): автоматически подставляет Bearer-токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;