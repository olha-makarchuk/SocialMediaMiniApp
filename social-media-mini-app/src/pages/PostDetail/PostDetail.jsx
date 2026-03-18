import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  ImageList,
  ImageListItem,
  Divider,
  Collapse,
  Box,
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

import {
  deletePostAsync,
  fetchPostByIdAsync,
  likePostAsync,
} from "../../features/posts/postsApi";
import {
  selectPostById,
  getPostsError,
  selectPostsStatus,
} from "../../features/posts/postsSelectors";
import { optimisticLike, revertLike } from "../../features/posts/postsSlice";

import CommentList from "../../components/Comment/CommentList";
import CommentForm from "../../components/Comment/CommentForm";
import MenuListComposition from "../../components/common/MenuListComposition";
import DeleteConfirmDialog from "../../components/Post/DeleteConfirmDialog";
import { useAuth } from "../../hooks/useAuth";
import { fetchUserAsync } from "../../features/users/usersApi";
import { selectUserById } from "../../features/users/usersSelector";

function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();
  const post = useSelector((state) => selectPostById(state, postId));
  const postStatus = useSelector(selectPostsStatus);
  const postError = useSelector(getPostsError);
  const author = useSelector((state) => selectUserById(state, post.authorId));

  const userId = user?.id;

  const [isReplying, setIsReplying] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPostByIdAsync(postId));
  }, [dispatch, postId]);

  useEffect(() => {
    if (!author) {
      dispatch(fetchUserAsync(post.authorId));
    }
  }, [dispatch, post, author]);

  const handleLike = async () => {
    if (!post) return;

    if (post.isLiked) {
      dispatch(revertLike(post.id));
    } else {
      dispatch(optimisticLike(post.id));
    }

    try {
      await dispatch(likePostAsync(post.id)).unwrap();
    } catch (error) {
      console.error("Помилка лайка:", error);
      if (post.isLiked) {
        dispatch(optimisticLike(post.id));
      } else {
        dispatch(revertLike(post.id));
      }
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deletePostAsync(post.id)).unwrap();
      navigate("/feed");
    } catch (error) {
      console.error("Не вдалося видалити пост:", error);
    } finally {
      setIsDialogOpen(false);
    }
  };

  if (postStatus === "loading" && !post) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Завантаження контенту...</Typography>
      </Box>
    );
  }

  if (!post) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          {postError || "Пост не знайдено"}
        </Typography>
        <Button variant="contained" onClick={() => navigate("/feed")}>
          Повернутися до стрічки
        </Button>
      </Container>
    );
  }

  const handleNavigateToProfile = () => {
    navigate(`/profile/${post.authorId}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardHeader
          avatar={
            <Avatar
            src={author.avatar}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToProfile();
              }}
              sx={{ bgcolor: "secondary.main" }}
            >
              {post.authorId}
            </Avatar>
          }
          action={
            post.authorId === userId && (
              <MenuListComposition
                onEdit={() => navigate(`/postedit/${post.id}`)}
                onDelete={() => setIsDialogOpen(true)}
              />
            )
          }
          title={author.name}
          subheader={
            post.createdAt
              ? formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: uk,
                })
              : ""
          }
        />

        <CardContent>
          <Typography
            variant="body1"
            sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
          >
            {post.content}
          </Typography>
        </CardContent>

        {post.images?.length > 0 && (
          <CardMedia sx={{ cursor: "pointer", bgcolor: "#f0f0f0" }}>
            <ImageList
              sx={{
                width: "100%",
                m: 0,
                "& .MuiImageListItem-root": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              }}
              cols={post.images?.length > 1 ? 2 : 1}
              rowHeight={post.images?.length > 1 ? 300 : 500}
            >
              {post.images?.map((img, index) => (
                <ImageListItem
                  key={index}
                  sx={{ bgcolor: "#e8e8e8", overflow: "hidden" }}
                >
                  <img
                    src={img}
                    alt="post content"
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </CardMedia>
        )}

        <CardActions disableSpacing sx={{ px: 2, pb: 2 }}>
          <IconButton
            aria-label="like"
            color={post.isLiked ? "error" : "default"}
            onClick={handleLike}
          >
            {post.isLiked ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Typography variant="body2" sx={{ mr: 3 }}>
            {post.likesCount}
          </Typography>

          <IconButton aria-label="show comments" color="default">
            <ChatBubbleOutline />
          </IconButton>
          <Typography variant="body2" sx={{ mr: 2 }}>
            {post.commentsCount}
          </Typography>

          <IconButton sx={{ ml: "auto" }}>
            <Share />
          </IconButton>
        </CardActions>

        <Divider />
        <CardContent sx={{ bgcolor: "#fafafa" }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontSize: "1rem", fontWeight: 700 }}
          >
            Коментарі
          </Typography>

          <CommentList postId={post.id} />

          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              onClick={() => setIsReplying(!isReplying)}
              sx={{
                borderRadius: "20px",
                px: 4,
                background: isReplying
                  ? "gray"
                  : "linear-gradient(45deg, #0f5d9d 30%, #04a1c5 90%)",
              }}
            >
              {isReplying ? "Відмінити" : "Написати коментар"}
            </Button>
          </Box>

          {isReplying && (
            <Box sx={{ mt: 2 }}>
              <CommentForm
                postId={post.id}
                onSuccess={() => setIsReplying(false)}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}

export default PostDetail;
