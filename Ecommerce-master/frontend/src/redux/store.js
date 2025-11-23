import {configureStore} from '@reduxjs/toolkit';
import vehiclesReducer from './vehiclesSlice.js';
<<<<<<< Updated upstream
import pedidosReducer from "./pedidosSlice.js"
=======
import ordersReducer from './ordersSlice.js';

>>>>>>> Stashed changes

const store = configureStore({
  reducer: { 
    vehicles: vehiclesReducer,
<<<<<<< Updated upstream
    pedidos: pedidosReducer,
=======
    orders: ordersReducer,
>>>>>>> Stashed changes
  },
});

export default store
