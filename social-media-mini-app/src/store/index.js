import { configureStore } from "@reduxjs/toolkit";
import asyncErrorHandler from "./middleware/asyncErrorHandler";
import authReducer from "../features/auth/authSlice";
import postsReducer from "../features/posts/postsSlice";
import commentsReducer from "../features/comments/commentsSlice";
import usersReducer from "../features/users/usersSlice";
import searchReducer from "../features/search/searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    users: usersReducer,
    search: searchReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(asyncErrorHandler),

  devTools: import.meta.env.MODE !== "production",
});

export default store;

export const RootState = store.getState;
export const AppDispatch = store.dispatch;
