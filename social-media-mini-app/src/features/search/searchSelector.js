import { createSelector } from "@reduxjs/toolkit";

const selectSearchState = (state) => state.search;

export const selectSearchQuery = (state) => selectSearchState(state).query;
export const selectSearchResults = (state) => selectSearchState(state).results;
export const selectSearchHistory = (state) => selectSearchState(state).history;
export const selectSearchStatus = (state) => selectSearchState(state).status;

export const selectFoundUsers = createSelector(
  [selectSearchResults],
  (results) => results.users
);

export const selectFoundPosts = createSelector(
  [selectSearchResults],
  (results) => results.posts
);