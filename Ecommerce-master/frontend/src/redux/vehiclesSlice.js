import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4002/vehicles';

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async (_, thunkAPI) => {
      const { data } = await axios.get(API_URL);
      console.log('🚀 fetchVehicles fulfilled, count:', Array.isArray(data) ? data.length : 0);

      const normalized = Array.isArray(data)
        ? data.map(v => ({ ...v, id: v.idVehiculo ?? v.id ?? v.idVehicle }))
        : data;

      return normalized;
  },

  {
    
  }
);

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: { items: [], loading: false, error: null, fetched: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.fetched = true;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || 'Unknown error';
      });
  }
});

export default vehiclesSlice.reducer;