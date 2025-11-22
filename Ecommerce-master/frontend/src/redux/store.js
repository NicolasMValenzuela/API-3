import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';
import pedidosReducer from "./pedidosSlice.js"

const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
    pedidos: pedidosReducer,
  },
});

export default store
