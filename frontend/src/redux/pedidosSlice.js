import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";

export const fetchPedidos = createAsyncThunk(
  "pedidos/fetchPedidos",
  async () => {
      const { data } = await axiosInstance.get("/pedidos");
      return data;
  }
);

export const fetchMisPedidos = createAsyncThunk(
  "pedidos/fetchMisPedidos",
  async () => {
      const { data } = await axiosInstance.get("/pedidos/mis-pedidos");
      return data;
  }
);

export const crearPedido = createAsyncThunk(
  "pedidos/crearPedido",
  async (nuevoPedido) => {
      const { data } = await axiosInstance.post("/pedidos", nuevoPedido);
      return data
  }
);

export const actualizarPedido = createAsyncThunk(
  "pedidos/actualizarPedido",
  async ({ idPedido, nuevoEstado }) => {
      const { data } = await axiosInstance.patch(`/pedidos/${idPedido}/estado`, { estado: nuevoEstado });
      return data;
  }
);

export const eliminarPedido = createAsyncThunk(
  "pedidos/eliminarPedido",
  async (idPedido) => {
      await axiosInstance.delete(`/pedidos/${idPedido}`);
      return idPedido;
  }
);


const pedidosSlice = createSlice({
  name: "pedidos",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchPedidos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPedidos.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchPedidos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchMisPedidos.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMisPedidos.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchMisPedidos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(crearPedido.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearPedido.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); 
      })
      .addCase(crearPedido.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(actualizarPedido.fulfilled, (state, action) => {
      const actualizado = action.payload;
        state.list = state.list.map(p =>
          p.idPedido === actualizado.idPedido ? actualizado : p
        );
      })

      .addCase(eliminarPedido.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.idPedido !== action.payload);
      })
    
  },
})

export default pedidosSlice.reducer;


