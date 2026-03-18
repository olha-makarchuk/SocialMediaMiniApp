import { createAsyncThunk } from "@reduxjs/toolkit";
import { search } from "../../utils/mockAPI";

export const searchAsync = createAsyncThunk(
  "search/executeSearch",
  async (text, { rejectWithValue }) => {
    if (!text || text.trim().length < 2) {
      return { posts: [], users: [] };
    }
    
    try {
      const response = await search(text);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Помилка під час пошуку");
    }
  }
);