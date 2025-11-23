import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const URL = 'http://localhost:4002/orders';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {const {data} = await axios.get(URL)
  return data})

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { 
    items: [], 
    loading: false, 
    error: null, 
    fetched: false 
  },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.items = action.payload;
            state.fetched = true;
        })
        .addCase(fetchOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
})

export default ordersSlice.reducer;