import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const getBalance = createAsyncThunk(
  "service/getBalance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/balance");
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getServices = createAsyncThunk(
  "service/getServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/services");
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getBanners = createAsyncThunk(
  "service/getBanners",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/banner");
      return response.data?.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  balance: null,
  services: [],
  banners: [],
  selectedService: null,
  loadingBalance: false,
  loadingServices: false,
  loadingBanners: false,
  error: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setSelectedService: (state, action) => {
      state.selectedService = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.pending, (state) => {
        state.loadingBalance = true;
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.loadingBalance = false;
        state.balance = action.payload;
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.loadingBalance = false;
        state.error = action.payload;
      })
      .addCase(getServices.pending, (state) => {
        state.loadingServices = true;
      })
      .addCase(getServices.fulfilled, (state, action) => {
        state.loadingServices = false;
        state.services = action.payload;
      })
      .addCase(getServices.rejected, (state, action) => {
        state.loadingServices = false;
        state.error = action.payload;
      })
      .addCase(getBanners.pending, (state) => {
        state.loadingBanners = true;
      })
      .addCase(getBanners.fulfilled, (state, action) => {
        state.loadingBanners = false;
        state.banners = action.payload;
      })
      .addCase(getBanners.rejected, (state, action) => {
        state.loadingBanners = false;
        state.error = action.payload;
      });
  },
});

export const { setSelectedService } = serviceSlice.actions;
export default serviceSlice.reducer;
