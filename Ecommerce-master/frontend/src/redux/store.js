import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';

import pedidosReducer from "./pedidosSlice.js"

import ordersReducer from './ordersSlice.js';



const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,

    pedidos: pedidosReducer,
    
    orders: ordersReducer,

  },
});

export default store
