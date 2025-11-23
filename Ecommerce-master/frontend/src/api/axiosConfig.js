import axios from 'axios';

let tokenInMemory = null;

export const setToken = (token) => {
    tokenInMemory = token;
};



// Creamos una instancia de axios
const axiosInstance = axios.create({
    baseURL: 'http://localhost:4002', // Tu URL base
    headers: {
        'Content-Type': 'application/json',
    },
    });

    // INTERCEPTOR: Antes de cada petición, busca el token en Redux
    axiosInstance.interceptors.request.use(
    (config) => {
        // Leemos el estado actual de Redux
        const state = store.getState();
        const token = state.auth.token; // Aquí está el token en RAM

        if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    );

export default axiosInstance;