import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';


const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
  },
});

export default store;