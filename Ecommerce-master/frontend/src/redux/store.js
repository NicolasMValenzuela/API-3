import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';
import pedidosReducer from './pedidosSlice.js';
import authReducer from "./authSlice.js";




export const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,

    pedidos: pedidosReducer,

    auth: authReducer,

  },
});

export default store;
