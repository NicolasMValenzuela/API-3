import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig.js";


export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
      const resp = await axiosInstance.get("/carritos/mine");
      return resp.data; 
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (vehiculoId, { getState}) => {
      let { idCarrito } = getState().cart;

      if (!idCarrito) {
        const respCarrito = await axiosInstance.get("/carritos/mine");
        idCarrito = respCarrito.data.idCarrito;
      }

      const resp = await axiosInstance.post(`/carritos/${idCarrito}/items`, {
        vehiculo: { idVehiculo: vehiculoId },
      });

      return resp.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { getState }) => {
      await axiosInstance.delete(`/carritos/items/${itemId}`);

      const { idCarrito } = getState().cart;

      if (!idCarrito) {
        return { idCarrito: null, items: [] };
      }

      const resp = await axiosInstance.get(`/carritos/${idCarrito}`);
      return resp.data;
    }
);

const initialState = {
  idCarrito: null,
  items: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    
    clearCart: (state) => {
      state.idCarrito = null;
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
  
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.idCarrito = action.payload.idCarrito || null;
        state.items = (action.payload.items || []).map(item => ({
          ...item,
          idVehiculo: item.vehiculoId || item.vehiculo?.idVehiculo || item.idVehiculo
        }));
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al cargar el carrito";
      })

      
      .addCase(addToCart.fulfilled, (state, action) => {
        state.idCarrito = action.payload.idCarrito || state.idCarrito;
        state.items = (action.payload.items || []).map(item => ({
          ...item,
          idVehiculo: item.vehiculoId || item.vehiculo?.idVehiculo || item.idVehiculo
        }));
        state.status = "succeeded";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al agregar al carrito";
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.idCarrito = action.payload.idCarrito || state.idCarrito;
        state.items = (action.payload.items || []).map(item => ({
          ...item,
          idVehiculo: item.vehiculoId || item.vehiculo?.idVehiculo || item.idVehiculo
        }));
        state.status = "succeeded";
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Error al quitar del carrito";
      });
  },
});

export const { clearCart } = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartId = (state) => state.cart.idCarrito;
export const selectCartCount = (state) => state.cart.items.length;

export default cartSlice.reducer;

