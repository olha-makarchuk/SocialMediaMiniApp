import { createAsyncThunk } from "@reduxjs/toolkit";
import {fetchComments, addComment, deleteComment, likeComment} from "../../utils/mockAPI";

export const fetchCommentsAsync = createAsyncThunk(
  "comments/fetchComments",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await fetchComments(postId);
      return { postId, comments: response };
    } catch (error) {
      return rejectWithValue(error.message || "Не вдалося завантажити коментарі");
    }
  }
);

export const addCommentAsync = createAsyncThunk(
    "comments/addComment",
    async(commentData, {rejectWithValue}) => {
        try{
            const response = await addComment(commentData);

            return response;
        }catch(error){
            return rejectWithValue(error.message || "Не вдалося завантажити коментарі")
        }
    }
)

export const deleteCommentAsync = createAsyncThunk(
    "comments/deleteComment",
    async(commentId, {rejectWithValue}) => {
        try{
            const response = await deleteComment(commentId);

            return response;
        }catch(error){
            return rejectWithValue(error.message || "Не вдалося завантажити коментарі")
        }
    }
)

export const likeCommentAsync = createAsyncThunk(
    "comments/likeComment",
    async(commentId, {rejectWithValue}) => {
        try{
            const response = await likeComment(commentId);

            return response;
        }catch(error){
            return rejectWithValue(error.message || "Не вдалося завантажити коментарі")
        }
    }
)