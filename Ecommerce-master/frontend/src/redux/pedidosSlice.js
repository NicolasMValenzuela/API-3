import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { fetchConToken } from "../api/api"


export const fetchPedidos = createAsyncThunk(
  "pedidos/fetchPedidos",
  async (_, thunkAPI) => {
    try {
      const data = await fetchConToken("/pedidos")
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)


export const updatePedidoEstado = createAsyncThunk(
  "pedidos/updatePedidoEstado",
  async ({ pedidoId, nuevoEstado }, thunkAPI) => {
    try {
      const data = await fetchConToken(`/pedidos/${pedidoId}/estado`, "PATCH", { estado: nuevoEstado })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

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
      .addCase(updatePedidoEstado.fulfilled, (state, action) => {
        const updated = action.payload
        state.list = state.list.map(p =>
          p.idPedido === updated.idPedido ? updated : p
        )
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

  },
})

export default pedidosSlice.reducer

export const fetchMisPedidos = createAsyncThunk(
  "pedidos/fetchMisPedidos",
  async (_, thunkAPI) => {
    try {
      const data = await fetchConToken("/pedidos/mis-pedidos")
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)
