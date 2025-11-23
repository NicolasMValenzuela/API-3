import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setToken } from '../api/axiosConfig';


const AUTH_URL = "http://localhost:4002/api/v1/auth";

// 1. LOGIN
export const loginUser = createAsyncThunk(
    "auth/login",
        async (credentials, { rejectWithValue }) => {
            const response = await axios.post(`${AUTH_URL}/authenticate`, credentials);
            return response.data;
        }
    );

    // 2. REGISTER
    export const registerUser = createAsyncThunk(
    "auth/register",
        async (userData, { rejectWithValue }) => {
            const response = await axios.post(`${AUTH_URL}/register`, userData);
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
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.token = action.payload.access_token; //  El token vive solo aca
            setToken(action.payload.access_token);

        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = typeof action.payload === 'string' ? action.payload : 'Error de credenciales';
        })
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