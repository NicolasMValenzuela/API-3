import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { setToken } from '../api/axiosConfig';


const AUTH_URL = "/api/v1/auth";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
      const response = await axiosInstance.post(`${AUTH_URL}/authenticate`, credentials);
      return response.data;
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
      const response = await axiosInstance.post(`${AUTH_URL}/register`, userData);
      return response.data;
  }
);

    const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        registerSuccess: false,
    },
    reducers: {
        logout: (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        setToken(null);
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
            state.token = action.payload.access_token;
            state.user = action.payload.user;
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
