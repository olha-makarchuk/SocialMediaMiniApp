import { createSlice } from "@reduxjs/toolkit";
import { loginAsync, registerAsync } from "./authAPI";
import { removeFromLocalStorage, getFromLocalStorage } from "../../utils/localStorage";

const initialState = {
  user: getFromLocalStorage("USER") || null,
  token: getFromLocalStorage ("AUTH_TOKEN") || null,
  isAuthenticated:  !!getFromLocalStorage("USER"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      removeFromLocalStorage("AUTH_TOKEN");
      removeFromLocalStorage("USER");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })

      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;