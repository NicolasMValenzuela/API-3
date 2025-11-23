import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';

import pedidosReducer from "./pedidosSlice.js"

import ordersReducer from './ordersSlice.js';


import authReducer from './authSlice.js';

import cartReducer from './cartSlice.js';

export const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
    pedidos: pedidosReducer,
    orders: ordersReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});

export default store;