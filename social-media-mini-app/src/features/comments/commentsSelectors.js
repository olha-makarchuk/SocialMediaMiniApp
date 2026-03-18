import { createSelector } from "@reduxjs/toolkit";

const selectCommentsState = (state) => state.comments;

export const selectCommentsById = (state) => selectCommentsState(state).byId;

export const selectCommentsStatus = (state) => selectCommentsState(state).status;
export const selectCommentsError = (state) => selectCommentsState(state).error;

export const selectCommentsByPostId = createSelector(
  [selectCommentsById, (state) => selectCommentsState(state).byPostId, (state, postId) => postId],
  (byId, byPostId, postId) => {
    const commentIds = byPostId[postId] || [];
    return commentIds.map((id) => byId[id]).filter(Boolean);
  }
);

export const selectCommentsTreeByPostId = createSelector(
  [selectCommentsByPostId],
  (postComments) => {
    const rootComments = postComments.filter(c => c.parentId === null);
    
    return rootComments.map(root => ({
      ...root,
      replies: postComments.filter(reply => reply.parentId === root.id)
    }));
  }
);