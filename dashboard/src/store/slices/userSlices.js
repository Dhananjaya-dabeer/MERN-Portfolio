import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    user: {},
    isAuthenticated: false,
    error: null,
    message: null,
    isUpdated: false,
  },
  reducers: {
    loginRequest(state, action) {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailed(state, action) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = action.payload;
    },
    clearAllErrors(state) {
      state.error = null;
    },
    logout(state) {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = {};
      state.error = null;
    },
    UpdateUser(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.isUpdated = true;
    },
  },
});

export const {
  loginFailed,
  loginRequest,
  loginSuccess,
  clearAllErrors,
  logout,
  UpdateUser,
} = userSlice.actions;

export default userSlice.reducer;
