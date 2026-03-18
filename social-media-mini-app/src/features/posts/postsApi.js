import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  likePost,
  createPost,
  fetchPosts,
  deletePost,
  updatePost,
  fetchPostById,
} from "../../utils/mockAPI";

export const fetchPostsAsync = createAsyncThunk(
  "posts/fetchAll",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await fetchPosts(page, limit);
      return { ...response, page }; 
    } catch (error) {
      return rejectWithValue(error.message || "Не вдалося завантажити пости");
    }
  }
);

export const createPostAsync = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await createPost(postData);

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Не вдалося створити пост");
    }
  },
);

export const updatePostAsync = createAsyncThunk(
  "posts/updatePost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await updatePost(postData);

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Не вдалося оновити пост");
    }
  },
);

export const deletePostAsync = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await deletePost(postId);

      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Не видалити пост");
    }
  },
);

export const likePostAsync = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await likePost(postId);
      return response;
    } catch (error) {
      return rejectWithValue({ postId, error: error.message });
    }
  }
);

export const fetchPostByIdAsync = createAsyncThunk(
  "posts/fetchById",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetchPostById(postId); 
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Пост не знайдено");
    }
  }
);