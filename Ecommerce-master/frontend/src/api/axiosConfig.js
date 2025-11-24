import axios from "axios";
import { API_BASE_URL } from "./api";

// Leer el token del localStorage al inicializar
let tokenInMemory = localStorage.getItem('authToken') || null;

export const setToken = (token) => {
  tokenInMemory = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" }
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (tokenInMemory) {
      config.headers.Authorization = `Bearer ${tokenInMemory}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
