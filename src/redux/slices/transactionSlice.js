import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const topupBalance = createAsyncThunk(
  "transaction/topupBalance",
  async (top_up_amount, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/topup", { top_up_amount });
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transaction/createTransaction",
  async (service_code, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/transaction", { service_code });
      return response.data?.data || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getTransactionHistory = createAsyncThunk(
  "transaction/getTransactionHistory",
  async ({ limit, offset }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/transaction/history", {
        params: { limit, offset },
      });
      return {
        data: response.data?.data?.records || response.data?.data || [],
        limit,
        offset,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  history: [],
  loadingTopup: false,
  loadingPay: false,
  loadingHistory: false,
  hasMore: true,
  error: null,
};

const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    clearTransactionError: (state) => {
      state.error = null;
    },
    resetHistory: (state) => {
      state.history = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(topupBalance.pending, (state) => {
        state.loadingTopup = true;
        state.error = null;
      })
      .addCase(topupBalance.fulfilled, (state) => {
        state.loadingTopup = false;
      })
      .addCase(topupBalance.rejected, (state, action) => {
        state.loadingTopup = false;
        state.error = action.payload;
      })
      .addCase(createTransaction.pending, (state) => {
        state.loadingPay = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state) => {
        state.loadingPay = false;
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loadingPay = false;
        state.error = action.payload;
      })
      .addCase(getTransactionHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loadingHistory = false;
        const newItems = action.payload.data;
        if (action.payload.offset === 0) {
          state.history = newItems;
        } else {
          state.history = [...state.history, ...newItems];
        }
        state.hasMore = newItems.length >= action.payload.limit;
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.error = action.payload;
      });
  },
});

export const { clearTransactionError, resetHistory } = transactionSlice.actions;
export default transactionSlice.reducer;
