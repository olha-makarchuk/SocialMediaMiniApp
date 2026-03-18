import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUser,
  fetchUsers,
  updateUserProfile,
  followUser,
  unfollowUser,
} from "../../utils/mockAPI";

export const fetchUserAsync = createAsyncThunk(
  "users/fetchUser",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetchUser(userId);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Не вдалося завантажити дані про користувача",
      );
    }
  },
);

export const fetchUsersAsync = createAsyncThunk(
  "users/fetchUsers",
  async ({page = 1, limit = 10}, { rejectWithValue }) => {
    try {
      const response = await fetchUsers(page, limit);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Не вдалося завантажити дані про користувачів",
      );
    }
  },
);

export const updateUserProfileAsync = createAsyncThunk(
  "users/updateUserProfile",
  async (user, { rejectWithValue }) => {
    try {
      const response = await updateUserProfile(user);

      return response;
    } catch (error) {
      return rejectWithValue(
        error.message || "Не вдалося оновити дані про користувача",
      );
    }
  },
);

export const followUserAsync = createAsyncThunk(
  "users/followUser",
  async ({ userid, followedUserId }, { rejectWithValue }) => {
    try {
      const response = await followUser(userid, followedUserId);

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Помилка сервера");
    }
  },
);

export const unfollowUserAsync = createAsyncThunk(
  "users/unfollowUser",
  async ({ userid, followedUserId }, { rejectWithValue }) => {
    try {
      const response = await unfollowUser(userid, followedUserId);

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Помилка сервера");
    }
  },
);