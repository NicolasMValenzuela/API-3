import axios from "axios";
import { API_BASE_URL } from "./api";

// Token en memoria
let tokenInMemory = null;

// Función para setear el token desde cualquier parte de la app
export const setToken = (token) => {
  tokenInMemory = token;
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
