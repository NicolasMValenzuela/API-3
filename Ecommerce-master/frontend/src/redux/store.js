import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';

import pedidosReducer from "./pedidosSlice.js"

import ordersReducer from './ordersSlice.js';


import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
  },
});
