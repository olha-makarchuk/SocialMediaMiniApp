import {
  TextField,
  Box,
  Typography,
  Button,
  Container,
  Link,
  Paper,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerAsync } from "../../features/auth/authAPI";
import {
  getAuthLoading,
  getAuthError,
} from "../../features/auth/authSelectors";
import { Alert, CircularProgress } from "@mui/material";

function Register() {
  const dispatch = useDispatch();
  const isLoading = useSelector(getAuthLoading);
  const error = useSelector(getAuthError);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerAsync({ email, password }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        backgroundColor: "var(--bg-main)",
      }}
    >
      <Container maxWidth="xs">
        <Typography
          variant="h4"
          align="center"
          sx={{
            color: "var(--primary)",
            mb: 4,
            fontWeight: 800,
            letterSpacing: "-1px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          Link
        </Typography>

        <Paper
          elevation={0}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "var(--bg-main)",
            borderRadius: 4,
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ color: "var(--text-main)", mb: 1, fontWeight: 700 }}
          >
            Реєстрація
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "var(--text-muted)", mb: 3 }}
          >
            Будь ласка, введіть свої дані
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              id="username"
              label="Ім'я"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required
            />

            <TextField
              id="nickname"
              label="Нікнейм"
              fullWidth
              margin="normal"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              disabled={isLoading}
              required
            />

            <TextField
              id="email"
              label="Електронна пошта"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <TextField
              id="password"
              label="Пароль"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ color: "var(--primary)", textDecoration: "none" }}
              >
                Забули пароль?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              sx={{ mt: 4, mb: 2, py: 1.5 }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Зареєструватися"}
            </Button>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: "var(--text-muted)", mt: 2 }}
            >
              Є акаунту?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: "var(--primary)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Увійти
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
