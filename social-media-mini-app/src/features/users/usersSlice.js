import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserAsync,
  fetchUsersAsync,
  updateUserProfileAsync,
  followUserAsync,
  unfollowUserAsync
} from "./usersApi";

const initialState = {
  byId: {},
  allIds: [],
  currentUserId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    optimisticFollow: (state, action) => {
      const userId = action.payload;
      const user = state.byId[userId];
      if (user) {
        user.isFollowing = true;
        user.followersCount += 1;
      }
    },
    revertFollow: (state, action) => {
      const userId = action.payload;
      const user = state.byId[userId];
      if (user) {
        user.isFollowing = false;
        user.followersCount -= 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const user = action.payload;
        state.byId[user.id] = user;
        if (!state.allIds.includes(user.id)) state.allIds.push(user.id);
        state.currentUserId = user.id;
      })
      .addCase(fetchUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Не вдалося завантажити профіль";
      })

      .addCase(fetchUsersAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsersAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach(user => {
          state.byId[user.id] = { ...state.byId[user.id], ...user };
          if (!state.allIds.includes(user.id)) state.allIds.push(user.id);
        });
      })
      .addCase(fetchUsersAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Помилка завантаження користувачів";
      })

      .addCase(updateUserProfileAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfileAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedUser = action.payload;
        state.byId[updatedUser.id] = { ...state.byId[updatedUser.id], ...updatedUser };
      })
      .addCase(updateUserProfileAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Не вдалося оновити профіль";
      })

      .addCase(followUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { userId, followersCount } = action.payload;
        if (state.byId[userId]) {
          state.byId[userId].followersCount = followersCount;
          state.byId[userId].isFollowing = true;
        }
      })
      .addCase(followUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Помилка підписки";
      })

      .addCase(unfollowUserAsync.pending, (state) => {
        state.error = null;
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const { userId, followersCount } = action.payload;
        if (state.byId[userId]) {
          state.byId[userId].followersCount = followersCount;
          state.byId[userId].isFollowing = false;
        }
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Не вдалося відписатися";
      });
  }
});

export const { optimisticFollow, revertFollow } = usersSlice.actions;
export default usersSlice.reducer;