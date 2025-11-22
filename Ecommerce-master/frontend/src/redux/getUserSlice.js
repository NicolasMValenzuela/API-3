import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

const API_URL = 'http://localhost:4002/users';

export const fetchUser = createAsyncThunk("user/fetchUser", async() => {
const {data} = await axios.get(API_URL)
return data
})

const getUserSlice = createSlice({
    
})