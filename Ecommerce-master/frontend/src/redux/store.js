import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';

import pedidosReducer from "./pedidosSlice.js"

import ordersReducer from './ordersSlice.js';


import authReducer from './slices/authSlice';

const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
<<<<<<< HEAD

    pedidos: pedidosReducer,
    
    

=======
>>>>>>> 1a37118f4d768469b0afc882522588f4b419cb99
  },
});
