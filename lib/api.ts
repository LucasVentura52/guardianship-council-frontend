import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  },
);

export function apiError(error: unknown, fallback = 'Não foi possível concluir a operação.') {
  if (axios.isAxiosError(error)) {
    const errors = error.response?.data?.errors;
    if (errors && typeof errors === 'object') {
      return Object.values(errors).flat().join(' ');
    }
    return error.response?.data?.message || fallback;
  }
  return fallback;
}

export default api;
