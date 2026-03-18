import { createSlice } from "@reduxjs/toolkit";
import {
  createPostAsync,
  deletePostAsync,
  fetchPostByIdAsync,
  fetchPostsAsync,
  likePostAsync,
  updatePostAsync,
} from "./postsApi";

const initialState = {
  posts: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  currentPage: 1,
  hasMore: true,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    optimisticLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.isLiked = true;
        post.likesCount += 1;
      }
    },
    revertLike: (state, action) => {
      const post = state.posts.find((p) => p.id === action.payload);
      if (post) {
        post.isLiked = false;
        post.likesCount -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPostsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPostsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { posts, hasMore, page } = action.payload;

        if (page === 1) {
          state.posts = posts;
        } else {
          const existingIds = new Set(state.posts.map((p) => p.id));
          const uniqueNewPosts = posts.filter((p) => !existingIds.has(p.id));
          state.posts = [...state.posts, ...uniqueNewPosts];
        }

        state.hasMore = hasMore;
        state.currentPage = page;
      })
      .addCase(fetchPostsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(createPostAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts.unshift(action.payload);
      })
      .addCase(createPostAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(deletePostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })

      .addCase(updatePostAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })

      .addCase(likePostAsync.fulfilled, (state, action) => {
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(likePostAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchPostByIdAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.posts.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        } else {
          state.posts.push(action.payload);
        }
      })
      .addCase(fetchPostByIdAsync.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      });
  },
});

export const { optimisticLike, revertLike } = postsSlice.actions;
export default postsSlice.reducer;
