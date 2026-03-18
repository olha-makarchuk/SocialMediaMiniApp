import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  CircularProgress,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { Delete, Save, ArrowBack } from "@mui/icons-material";

import {
  selectPostById,
  selectPostsStatus,
} from "../../features/posts/postsSelectors";
import {
  fetchPostByIdAsync,
  updatePostAsync,
} from "../../features/posts/postsApi";
import { useAuth } from "../../hooks/useAuth";

function EditPost() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const post = useSelector((state) => selectPostById(state, postId));
  const status = useSelector(selectPostsStatus);

  const [deletedIndices, setDeletedIndices] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (!post) {
      dispatch(fetchPostByIdAsync(postId));
    } else {
      reset({ content: post.content });
    }
  }, [post, postId, dispatch, reset]);

  const visibleImages = useMemo(() => {
    if (!post?.images) return [];
    return post.images.filter((_, index) => !deletedIndices.includes(index));
  }, [post, deletedIndices]);

  const handleDeleteImage = (originalIndex) => {
    setDeletedIndices((prev) => [...prev, originalIndex]);
  };

  const onSubmit = async (data) => {
    try {
      const updatedData = {
        id: postId,
        content: data.content,
        images: visibleImages,
      };

      await dispatch(updatePostAsync(updatedData)).unwrap();
      navigate(`/feed`);
    } catch (error) {
      console.error("Помилка при оновленні:", error);
    }
  };

  if (status === "loading" && !post) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (post && post.authorId !== user?.id) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => navigate("/feed")}
            >
              Назад
            </Button>
          }
        >
          У вас немає прав для редагування цього поста.
        </Alert>
      </Container>
    );
  }

  if (!post && status !== "loading") {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="warning">Пост не знайдено.</Alert>
      </Container>
    );
  }

  if (!post) return null;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            Редагування
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Текст поста"
            multiline
            rows={5}
            {...register("content", {
              required: "Це поле обов'язкове",
              maxLength: { value: 280, message: "Максимум 280 символів" },
            })}
            error={!!errors.content}
            helperText={errors.content?.message}
            sx={{ mb: 3 }}
          />

          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Зображення
            <Typography component="span" variant="body2" color="textSecondary">
              {visibleImages.length} з {post.images?.length || 0}
            </Typography>
          </Typography>

          {visibleImages.length > 0 ? (
            <ImageList
              sx={{ width: "100%", borderRadius: 1, mb: 3 }}
              cols={3}
              rowHeight={120}
              gap={8}
            >
              {post.images.map((img, index) => {
                if (deletedIndices.includes(index)) return null;

                return (
                  <ImageListItem
                    key={index}
                    sx={{
                      position: "relative",
                      borderRadius: 1,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={img}
                      alt={`post-${index}`}
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "rgba(255,255,255,0.8)",
                        "&:hover": { bgcolor: "white" },
                      }}
                      onClick={() => handleDeleteImage(index)}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </ImageListItem>
                );
              })}
            </ImageList>
          ) : (
            <Box
              sx={{
                p: 3,
                textAlign: "center",
                border: "1px dashed #ccc",
                borderRadius: 1,
                mb: 3,
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {post.images?.length > 0
                  ? "Усі фото буде видалено"
                  : "У цьому пості немає фото"}
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            startIcon={<Save />}
            disabled={isSubmitting}
            sx={{ py: 1.5, textTransform: "none", fontSize: "1.1rem" }}
          >
            {isSubmitting ? "Збереження..." : "Зберегти зміни"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default EditPost;
