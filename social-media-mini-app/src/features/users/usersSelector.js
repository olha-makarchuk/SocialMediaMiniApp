import { createSelector } from "@reduxjs/toolkit";

const selectUsersState = (state) => state.users;

export const selectUsersById = (state) => selectUsersState(state).byId;

export const selectAllUserIds = (state) => selectUsersState(state).allIds;

export const selectCurrentUserId = (state) => selectUsersState(state).currentUserId;

export const selectUsersStatus = (state) => selectUsersState(state).status;
export const selectUsersError = (state) => selectUsersState(state).error;

export const selectUserById = createSelector(
  [selectUsersById, (state, userId) => userId],
  (byId, userId) => byId[userId] || null
);

export const selectCurrentProfile = createSelector(
  [selectUsersById, selectCurrentUserId],
  (byId, currentId) => (currentId ? byId[currentId] : null)
);

export const selectAllUsersList = createSelector(
  [selectUsersById, selectAllUserIds],
  (byId, allIds) => allIds.map((id) => byId[id]).filter(Boolean)
);

export const selectIsFollowing = createSelector(
  [selectUserById],
  (user) => user?.isFollowing || false
);