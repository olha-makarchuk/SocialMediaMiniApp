import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { PhotoCamera, ArrowBack } from "@mui/icons-material";

import { useAuth } from "../../hooks/useAuth";
import { updateUserProfileAsync } from "../../features/users/usersApi";
import {
  selectUsersStatus,
  selectUsersError,
} from "../../features/users/usersSelector";

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const status = useSelector(selectUsersStatus);
  const error = useSelector(selectUsersError);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
  });

  if (!user) return <CircularProgress />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(
      updateUserProfileAsync({ ...user, ...formData }),
    );

    if (updateUserProfileAsync.fulfilled.match(resultAction)) {
      navigate(`/profile/${user.id}`);
    }
  };

  if (!user) return <CircularProgress />;

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Назад
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Редагувати профіль
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Stack spacing={3} alignItems="center">
            <Box sx={{ position: "relative" }}>
              <Avatar
                src={formData.avatar}
                sx={{ width: 100, height: 100, border: "2px solid #ddd" }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "white",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <input hidden accept="image/*" type="file" />
                <PhotoCamera fontSize="small" />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              label="Повне ім'я"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <Typography sx={{ color: "text.secondary", mr: 0.5 }}>
                    @
                  </Typography>
                ),
              }}
              required
            />

            <TextField
              fullWidth
              label="Про себе (Bio)"
              name="bio"
              multiline
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Розкажіть про себе..."
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={status === "loading"}
              sx={{ borderRadius: 2, mt: 2, py: 1.5 }}
            >
              {status === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Зберегти зміни"
              )}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}

export default EditProfile;
