import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';
import pedidosReducer from './pedidosSlice.js';
import authReducer from './authSlice.js';
import cartReducer from './cartSlice.js';
import categoriesReducer from './categoriesSlice.js';

export const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
    pedidos: pedidosReducer,
    auth: authReducer,
    cart: cartReducer,
    categories: categoriesReducer,
  },
});
export default store;