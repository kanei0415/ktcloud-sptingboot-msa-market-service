import { getStorageData, STORAGE_KEYS } from "@libs/storage";
import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY_ENDPOINT,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const saved = getStorageData('LOCAL', STORAGE_KEYS.token)

    if (!saved) return config

    const token = JSON.parse(saved)

    if (token && config.headers)
      config.headers.Authorization = `Bearer ${token.accessToken}`;

    console.log(config)

    return config;
  },
  (error) => {
    console.error(error)

    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(response)

    return response;
  },
  async (error) => {
    console.error(error)

    return Promise.reject(error);
  }
);

export default api;