import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Share,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";

import { optimisticLike, revertLike } from "../../features/posts/postsSlice";
import { likePostAsync, deletePostAsync } from "../../features/posts/postsApi";
import CommentList from "../Comment/CommentList";
import CommentForm from "../Comment/CommentForm";
import { useNavigate } from "react-router-dom";
import MenuListComposition from "../common/MenuListComposition";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { useAuth } from "../../hooks/useAuth";
import { selectUserById } from "../../features/users/usersSelector";
import { fetchUserAsync } from "../../features/users/usersApi";

function PostCard({ post }) {
  const {
    id,
    content,
    images,
    likesCount,
    commentsCount,
    isLiked,
    createdAt,
    authorId,
  } = post;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const userId = user.id;
  const author = useSelector((state) => selectUserById(state, authorId));

  useEffect(() => {
    if (!author) {
      dispatch(fetchUserAsync(authorId));
    }
  }, [dispatch, authorId, author]);

  const handlePostDetailNavigation = () => {
    navigate(`/postdetail/${id}`);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleLike = async () => {
    if (isLiked) {
      dispatch(revertLike(id));
    } else {
      dispatch(optimisticLike(id));
    }

    try {
      await dispatch(likePostAsync(id)).unwrap();
    } catch (error) {
      console.error("Помилка лайка:", error);
      if (isLiked) {
        dispatch(optimisticLike(id));
      } else {
        dispatch(revertLike(id));
      }
    }
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmDelete = () => {
    dispatch(deletePostAsync(post.id));
    setIsDialogOpen(false);
  };

  const onDelete = () => {
    setIsDialogOpen(true);
  };

  const onEdit = () => {
    navigate(`/postedit/${id}`);
  };

  const handleNavigateToProfile = () => {
    navigate(`/profile/${authorId}`);
  };

  return (
    <Card
      sx={{ maxWidth: 600, mb: 3, mx: "auto", borderRadius: 2, boxShadow: 3 }}
    >
      <Box onClick={handlePostDetailNavigation} sx={{ cursor: "pointer" }}>
        <CardHeader
          avatar={
            <Avatar
            src={author?.avatar}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigateToProfile();
              }}
              sx={{ bgcolor: "secondary.main" }}
            />
          }
          action={
            authorId === userId && (
              <div>
                <MenuListComposition onEdit={onEdit} onDelete={onDelete} />
              </div>
            )
          }
          title={author?.name}
          subheader={formatDistanceToNow(new Date(createdAt), {
            addSuffix: true,
            locale: uk,
          })}
        />

        <CardContent sx={{ pt: 0 }}>
          <Typography variant="body1">{content}</Typography>
        </CardContent>
      </Box>

      {images?.length > 0 && (
        <CardMedia
          onClick={handlePostDetailNavigation}
          sx={{ cursor: "pointer", bgcolor: "#f0f0f0" }}
        >
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
            cols={images.length > 1 ? 2 : 1}
            rowHeight={images.length > 1 ? 300 : 500}
          >
            {images.map((img, index) => (
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

      <CardActions disableSpacing sx={{ px: 2 }}>
        <IconButton
          aria-label="like"
          color={isLiked ? "error" : "default"}
          onClick={handleLike}
        >
          {isLiked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount}
        </Typography>

        <IconButton
          aria-label="show comments"
          onClick={handleExpandClick}
          color={expanded ? "primary" : "default"}
        >
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {commentsCount}
        </Typography>

        <IconButton sx={{ ml: "auto" }}>
          <Share />
        </IconButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider sx={{ mx: 2 }} />
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Коментарі:
          </Typography>

          <CommentList postId={id} />

          <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setIsReplying(!isReplying)}
              sx={{
                textTransform: "none",
                borderRadius: "20px",
                px: 4,
                fontWeight: 600,
                background: isReplying
                  ? "linear-gradient(45deg, #757575 30%, #9e9e9e 90%)"
                  : "linear-gradient(45deg, #0f5d9d 30%, #04a1c5 90%)",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              {isReplying ? "Відмінити" : "Коментувати"}
            </Button>
          </Box>
          {isReplying && (
            <Box sx={{ mt: 1 }}>
              <CommentForm postId={id} onSuccess={() => setIsReplying(false)} />
            </Box>
          )}
        </CardContent>
      </Collapse>
      <DeleteConfirmDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Card>
  );
}

export default PostCard;
