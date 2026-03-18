import { createSlice } from "@reduxjs/toolkit";
import { searchAsync } from "./searchApi";

const initialState = {
  query: "",
  results: { posts: [], users: [] },
  history: JSON.parse(localStorage.getItem("search_history")) || [],
  status: "idle",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    addToHistory: (state, action) => {
      const newQuery = action.payload;
      state.history = [newQuery, ...state.history.filter(q => q !== newQuery)].slice(0, 5);
      localStorage.setItem("search_history", JSON.stringify(state.history));
    },
    removeFromHistory: (state, action) => {
      state.history = state.history.filter(q => q !== action.payload);
      localStorage.setItem("search_history", JSON.stringify(state.history));
    },
    clearHistory: (state) => {
      state.history = [];
      localStorage.removeItem("search_history");
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchAsync.rejected, (state) => {
        state.status = "failed";
      });
  }
});

export const { setQuery, addToHistory, removeFromHistory, clearHistory } = searchSlice.actions;
export default searchSlice.reducer;