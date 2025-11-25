import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4002/vehicles';

export const fetchVehicles = createAsyncThunk(
  'vehicles/fetchVehicles',
  async () => {
      const { data } = await axios.get(API_URL);
      const normalized = Array.isArray(data)
        ? data.map(v => ({ ...v, id: v.idVehiculo }))
        : data;

      return normalized;
  },

);

export const fetchVehicleImages = createAsyncThunk(
  'vehicles/fetchVehicleImages',
  async (vehicleIds) => {
    const requests = vehicleIds.map(id =>
      axios.get(`http://localhost:4002/vehicles/${id}/image`, {
        responseType: 'text'
      })
        .then(({ data }) => ({
          id,
          imageUrl: data ? `data:image/jpeg;base64,${data}` : null
        }))
        .catch(error => {
          console.error(`Error fetching image for vehicle ${id}:`, error);
          return { id, imageUrl: null };
        })
    );

    const results = await axios.all(requests);
    return results;
  }
);

export const fetchVehicleById = createAsyncThunk(
  'vehicles/fetchVehicleById',
  async (vehicleId) => {
    const { data } = await axios.get(`${API_URL}/${vehicleId}`);
    return { ...data, id: data.idVehiculo ?? data.id ?? data.idVehicle };
  }
);

export const postVehicle = createAsyncThunk(
  'vehicles/postVehicle',
  async (formData) => {
    const { data } = await axios.post(API_URL, formData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    return data;
  }
);

export const updateVehicle = createAsyncThunk(
  'vehicles/updateVehicle',
  async ({ id, vehicleData }) => {
    const { data } = await axios.put(`${API_URL}/${id}`, vehicleData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    return data;
  }
);

export const updateVehicleImage = createAsyncThunk(
  'vehicles/updateVehicleImage',
  async ({ id, imageFile }) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    await axios.put(`http://localhost:4002/vehicles/${id}/image`, formData, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    
    return { id };
  }
);

export const deleteVehicle = createAsyncThunk(
  'vehicles/deleteVehicle',
  async (vehicleId) => {
    await axios.delete(`${API_URL}/${vehicleId}`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    return vehicleId;
  }
);


const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState: { items: [], loading: false, error: null, fetched: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicles.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.fetched = true;
      })
      .addCase(fetchVehicles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message
      })
      .addCase(fetchVehicleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVehicleById.fulfilled, (state, action) => {
        state.loading = false;
        // Actualizar el vehículo en el estado si ya existe, sino agregarlo
        const index = state.items.findIndex(v => v.idVehiculo === action.payload.idVehiculo || v.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = {
            ...action.payload,
            id: action.payload.idVehiculo
          };
        } else {
          // Si no existe, agregarlo
          state.items.push({
            ...action.payload,
            id: action.payload.idVehiculo
          });
        }
      })
      .addCase(fetchVehicleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchVehicleImages.fulfilled, (state, action) => {
        action.payload.forEach(({ id, imageUrl }) => {
          const vehicle = state.items.find(v => v.idVehiculo === id || v.id === id);
          if (vehicle && imageUrl) {
            vehicle.imageUrl = imageUrl;
          }
        });
      })
      .addCase(fetchVehicleImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(postVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, { ...action.payload, id: action.payload.idVehiculo }];
      })
      .addCase(postVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicle.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(v => v.idVehiculo === action.payload.idVehiculo || v.id === action.payload.id);
        if (index !== -1) {
          const existingImage = state.items[index].imageUrl;
          state.items[index] = { ...action.payload, id: action.payload.idVehiculo };
          // Preservar la imagen que ya está en el estado
          if (existingImage) {
            state.items[index].imageUrl = existingImage;
          }
        }
      })
      .addCase(updateVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateVehicleImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVehicleImage.fulfilled, (state, action) => {
        state.loading = false;
        // No hacer nada aquí - la imagen se recargará con fetchVehicleImages
      })
      .addCase(updateVehicleImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteVehicle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVehicle.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(v => v.idVehiculo !== action.payload && v.id !== action.payload);
      })
      .addCase(deleteVehicle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  }
});

export default vehiclesSlice.reducer;