import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  Card,
  Divider,
  CardHeader,
  Avatar,
  CardContent,
  CardMedia,
  Container,
} from "@mui/material";
import { Delete, CloudUpload, ArrowBack, Send } from "@mui/icons-material";
import { createPostAsync } from "../../features/posts/postsApi";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [previews, setPreviews] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      content: "",
      images: [],
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("Можна завантажити не більше 4 зображень");
      return;
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setValue("images", files);
  };

  const fileToDataUri = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(file);
    });

  const handleNextStep = async () => {
    const isValid = await trigger("content");
    if (isValid) setStep(2);
  };

  const onSubmit = async (data) => {
    try {
      const imageUrls = await Promise.all(
        data.images.map((file) => fileToDataUri(file)),
      );

      const postData = {
        content: data.content,
        authorId: user?.id,
        images: imageUrls,
        createdAt: new Date().toISOString(),
      };

      await dispatch(createPostAsync(postData)).unwrap();
      navigate("/feed");
    } catch (error) {
      console.error("Помилка при створенні поста:", error);
    }
  };

  const previewContent = getValues("content");

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        {step === 1 ? "Створити пост" : "Попередній перегляд"}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Що у вас нового?"
              multiline
              rows={6}
              {...register("content", {
                required: "Напишіть що-небудь...",
                maxLength: {
                  value: 280,
                  message: "Текст занадто довгий (максимум 280 символів)",
                },
              })}
              error={!!errors.content}
              helperText={errors.content?.message}
            />

            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              sx={{ py: 2, borderStyle: "dashed" }}
            >
              Додати фото (до 10)
              <input
                type="file"
                hidden
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>

            {previews.length > 0 && (
              <ImageList
                sx={{ width: "100%", borderRadius: 1 }}
                cols={4}
                rowHeight={100}
              >
                {previews.map((url, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={url}
                      alt="preview"
                      style={{ height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "white",
                      }}
                      onClick={() => {
                        const newPreviews = previews.filter(
                          (_, i) => i !== index,
                        );
                        setPreviews(newPreviews);
                        const currentFiles = getValues("images");
                        const newFiles = Array.from(currentFiles).filter(
                          (_, i) => i !== index,
                        );
                        setValue("images", newFiles);
                      }}
                    >
                      <Delete fontSize="small" color="error" />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            )}

            <Button variant="contained" size="large" onClick={handleNextStep}>
              Далі
            </Button>
          </Box>
        )}

        {step === 2 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Container maxWidth="md" sx={{ py: 0, px: 0 }}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      {user?.id}
                    </Avatar>
                  }
                  title={`Автор #${user?.id}`}
                />

                <CardContent>
                  <Typography
                    variant="body1"
                    sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
                  >
                    {previewContent}
                  </Typography>
                </CardContent>

                {previews.length > 0 && (
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
                      cols={previews.length > 1 ? 2 : 1}
                      rowHeight={previews.length > 1 ? 300 : 500}
                    >
                      {previews.map((img, index) => (
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
              </Card>
            </Container>
            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => setStep(1)}
              >
                Редагувати
              </Button>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                endIcon={<Send />}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Публікація..." : "Опублікувати"}
              </Button>
            </Box>
          </Box>
        )}
      </form>
    </Box>
  );
}

export default CreatePost;
