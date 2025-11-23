import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';
import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
    auth: authReducer
  },
});

export default store;