import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCommentsAsync,
  addCommentAsync,
  deleteCommentAsync,
  likeCommentAsync,
} from "./commentsApi";

const initialState = {
  byId: {},
  allIds: [],
  byPostId: {},
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    optimisticLike: (state, action) => {
      const commentId = action.payload;
      const comment = state.byId[commentId];
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likesCount += comment.isLiked ? 1 : -1;
      }
    },
    revertLike: (state, action) => {
      const commentId = action.payload;
      const comment = state.byId[commentId];
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likesCount += comment.isLiked ? 1 : -1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCommentsAsync.fulfilled, (state, action) => {
        state.status = "succeeded";

        const { postId, comments = [] } = action.payload || {};

        state.byPostId[postId] = [];

        if (Array.isArray(comments)) {
          comments.forEach((comment) => {
            state.byId[comment.id] = comment;
            if (!state.allIds.includes(comment.id)) {
              state.allIds.push(comment.id);
            }
            state.byPostId[postId].push(comment.id);
          });
        } else {
          console.error("Очікувався масив коментарів, але отримано:", comments);
        }
      })
      .addCase(fetchCommentsAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Помилка завантаження";
      })

      .addCase(addCommentAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const comment = action.payload;
        const { id, postId } = comment;
        state.byId[id] = comment;
        state.allIds.push(id);
        if (!state.byPostId[postId]) state.byPostId[postId] = [];
        state.byPostId[postId].push(id);
      })
      .addCase(addCommentAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Не вдалося додати коментар";
      })

      .addCase(deleteCommentAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCommentAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        const commentId = action.payload;
        const comment = state.byId[commentId];
        if (comment) {
          const postId = comment.postId;
          state.byPostId[postId] = state.byPostId[postId].filter(
            (id) => id !== commentId,
          );
          state.allIds = state.allIds.filter((id) => id !== commentId);
          delete state.byId[commentId];
        }
      })
      .addCase(deleteCommentAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Не вдалося видалити коментар";
      })

      .addCase(likeCommentAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(likeCommentAsync.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        state.byId[updatedComment.id] = {
          ...state.byId[updatedComment.id],
          ...updatedComment,
        };
      })
      .addCase(likeCommentAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Помилка лайка";
      });
  },
});

export const { optimisticLike, revertLike } = commentsSlice.actions;
export default commentsSlice.reducer;
