import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import profileReducer from "./slices/profileSlice";
import serviceReducer from "./slices/serviceSlice";
import transactionReducer from "./slices/transactionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    service: serviceReducer,
    transaction: transactionReducer,
  },
});
