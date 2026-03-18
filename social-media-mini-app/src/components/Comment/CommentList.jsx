import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommentsTreeByPostId,
  selectCommentsError,
  selectCommentsStatus,
} from "../../features/comments/commentsSelectors";
import { fetchCommentsAsync } from "../../features/comments/commentsApi";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
import { Box, Typography } from "@mui/material";
import CommentItem from "./CommentItem";

function CommentList({ postId }) {
  const dispatch = useDispatch();

  const comments = useSelector((state) =>
    selectCommentsTreeByPostId(state, postId),
  );
  const error = useSelector(selectCommentsError);
  const status = useSelector(selectCommentsStatus);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCommentsAsync(postId));
    }
  }, [dispatch, postId, status]);

  if (status === "loading" && !comments.length) return <LoadingSpinner />;
  if (status === "failed") return <ErrorMessage error={error} />;

  return (
    <Box sx={{ mt: 2 }}>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))
      ) : (
        <Typography variant="caption" color="text.secondary">
          Коментарів поки немає. Будьте першим!
        </Typography>
      )}
    </Box>
  );
}

export default CommentList;
