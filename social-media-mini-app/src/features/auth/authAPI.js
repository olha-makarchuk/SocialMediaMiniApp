import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, register } from "../../utils/mockAPI";
import { setToLocalStorage } from "../../utils/localStorage";

export const loginAsync = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await login(email, password);

      setToLocalStorage("AUTH_TOKEN", response.token);
      setToLocalStorage("USER", response.user);

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const registerAsync = createAsyncThunk(
  "auth/register",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await register(name, email, password);

      setToLocalStorage("AUTH_TOKEN", response.token);
      setToLocalStorage("USER", response.user);

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);
