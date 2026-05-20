import axios from 'axios';
import { notifyUnauthorized } from '@libs/auth-events';
import { useAuthStore } from '@store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_ENDPOINT,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      const { clearAuth } = useAuthStore.getState();
      if (useAuthStore.getState().token) {
        clearAuth();
        notifyUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
