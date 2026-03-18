import { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import ReplyForm from "./ReplyForm";
import {
  likeCommentAsync,
  deleteCommentAsync,
} from "../../features/comments/commentsApi";
import {
  revertLike,
  optimisticLike,
} from "../../features/comments/commentsSlice";
import { useDispatch } from "react-redux";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";

function CommentItem({ comment, depth = 0 }) {
  const [isReplying, setIsReplying] = useState(false);
  const dispatch = useDispatch();

  const handleLike = async () => {
    if (comment.isLiked) {
      dispatch(revertLike(comment.id));
    } else {
      dispatch(optimisticLike(comment.id));
    }

    try {
      await dispatch(likeCommentAsync(comment.id)).unwrap();
    } catch (error) {
      console.error("Помилка лайка:", error);
      if (comment.isLiked) {
        dispatch(optimisticLike(comment.id));
      } else {
        dispatch(revertLike(comment.id));
      }
    }
  };

  const handleDeleteComment = () => {
    dispatch(deleteCommentAsync(comment.id));
  };

  return (
    <Box
      sx={{
        ml: depth * 3,
        mt: 2,
        borderLeft: depth > 0 ? "2px solid #e0e0e0" : "none",
        pl: depth > 0 ? 2 : 0,
      }}
    >
      <Paper
        elevation={1}
        sx={{
          p: 1.5,
          bgcolor: depth > 0 ? "#fcfcfc" : "white",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: "0.7rem" }}>
            {comment.authorId}
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
            Користувач {comment.authorId}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1 }}>
          {comment.content}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 0.5,
          }}
        >
          <Button
            size="small"
            onClick={() => setIsReplying(!isReplying)}
            sx={{
              fontSize: "0.75rem",
              textTransform: "none",
              minWidth: "unset",
              p: 0,
            }}
          >
            {isReplying ? "Відмінити" : "Відповісти"}
          </Button>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Кнопка лайка */}
            <IconButton
              size="small"
              aria-label="like"
              color={comment.isLiked ? "error" : "default"}
              onClick={handleLike}
              sx={{ p: 0.5 }}
            >
              {comment.isLiked ? (
                <Favorite fontSize="small" />
              ) : (
                <FavoriteBorder fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption" sx={{ mr: 1.5, minWidth: "10px" }}>
              {comment.likesCount}
            </Typography>

            <IconButton
              size="small"
              aria-label="delete-comment"
              onClick={handleDeleteComment}
              sx={{ p: 0.5, "&:hover": { color: "error.main" } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {isReplying && (
        <Box sx={{ mt: 1 }}>
          <ReplyForm
            postId={comment.postId}
            parentId={comment.id}
            onSuccess={() => setIsReplying(false)}
          />
        </Box>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <Box>
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default CommentItem;
