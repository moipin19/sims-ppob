import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axiosInstance";

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/registration", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/login", payload);
      const token = response.data?.data?.token || response.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  token: localStorage.getItem("token"),
  registerLoading: false,
  loginLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.token = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false;
        const token = action.payload?.data?.token || action.payload?.token || null;
        state.token = token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
