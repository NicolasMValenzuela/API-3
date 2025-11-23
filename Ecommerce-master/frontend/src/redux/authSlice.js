import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const AUTH_URL = "http://localhost:4002/api/v1/auth";

// 1. LOGIN
export const loginUser = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
        const response = await axios.post(`${AUTH_URL}/authenticate`, credentials);
        
        // ❌ YA NO HACEMOS ESTO:
        // localStorage.setItem("accessToken", response.data.access_token);
        
        return response.data; 
        } catch (error) {
        return rejectWithValue(error.response?.data || "Error al iniciar sesión");
        }
    }
    );

    // 2. REGISTER
    export const registerUser = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
        const response = await axios.post(`${AUTH_URL}/register`, userData);
        // Tampoco guardamos aquí
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data || "Error al registrarse");
        }
    }
    );

    const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null, // 👈 Arranca siempre en null (no lee localStorage)
        isAuthenticated: false,
        loading: false,
        error: null,
        registerSuccess: false,
    },
    reducers: {
        logout: (state) => {
        // Ya no hace falta borrar localStorage
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        },
        clearAuthState: (state) => {
        state.error = null;
        state.registerSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
        // Login
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.access_token; // ✅ El token vive solo AQUÍ
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === 'string' ? action.payload : 'Error de credenciales';
        })
        // Register
        .addCase(registerUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(registerUser.fulfilled, (state) => {
            state.loading = false;
            state.registerSuccess = true;
        })
        .addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Error en el registro";
        });
    },
});

export const { logout, clearAuthState } = authSlice.actions;
export default authSlice.reducer;