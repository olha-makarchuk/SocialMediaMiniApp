import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  Container,
  Grid,
  Avatar,
  Typography,
  Button,
  Box,
  Paper,
  Stack,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  selectUserById,
  selectUsersStatus,
} from "../../features/users/usersSelector";
import {
  fetchUserAsync,
  followUserAsync,
  unfollowUserAsync,
} from "../../features/users/usersApi";
import { fetchPostsAsync } from "../../features/posts/postsApi";
import { useAuth } from "../../hooks/useAuth";
import PostCard from "../../components/Post/PostCard";
import { logout } from "../../features/auth/authSlice";

export default function Profile() {
  const { profileId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const profile = useSelector((state) => selectUserById(state, profileId));
  const status = useSelector(selectUsersStatus);
  const isOwnProfile = String(currentUser?.id) === String(profile?.id);

  const allPosts = useSelector((state) => state.posts.posts);
  const userPosts = allPosts.filter(
    (post) => String(post.authorId) === String(profileId),
  );
  const postsStatus = useSelector((state) => state.posts.status);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    dispatch(fetchUserAsync(profileId));
    if (postsStatus === "idle") {
      dispatch(fetchPostsAsync());
    }
  }, [dispatch, profileId, postsStatus]);

  const handleFollowToggle = () => {
    const payload = { userid: currentUser.id, followedUserId: profile.id };
    if (profile.isFollowing) {
      dispatch(unfollowUserAsync(payload));
    } else {
      dispatch(followUserAsync(payload));
    }
  };

  if (status === "loading" && !profile)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (!profile && status !== "loading") {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" textAlign="center">
          Користувача з ID {profileId} не знайдено
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 4, mb: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} sm={4} display="flex" justifyContent="center">
            <Avatar
              src={profile.avatar}
              sx={{
                width: 150,
                height: 150,
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" fontWeight="bold">
              {profile.name}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              @{profile.username}
            </Typography>

            <Typography variant="body1" sx={{ my: 2 }}>
              {profile.bio}
            </Typography>

            <Box sx={{ mt: 2 }}>
              {isOwnProfile ? (
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate("/settings/profile")}
                    sx={{ borderRadius: 10, px: 4 }}
                  >
                    Редагувати профіль
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    sx={{ borderRadius: 10, px: 4 }}
                  >
                    Вийти
                  </Button>
                </>
              ) : (
                <Button
                  variant={profile.isFollowing ? "outlined" : "contained"}
                  onClick={handleFollowToggle}
                  sx={{ borderRadius: 10, px: 4 }}
                >
                  {profile.isFollowing ? "Відписатися" : "Підписатися"}
                </Button>
              )}
            </Box>

            <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {userPosts.length || profile.postsCount || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Пости
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {profile.followersCount || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Підписники
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {profile.followingCount || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Підписки
                </Typography>
              </Box>
            </Stack>

            {currentUser?.id !== profile.id && (
              <Button
                variant={profile.isFollowing ? "outlined" : "contained"}
                onClick={handleFollowToggle}
                sx={{ borderRadius: 10, px: 4 }}
              >
                {profile.isFollowing ? "Відписатися" : "Підписатися"}
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ mb: 3 }}>
        <Typography variant="h6" color="textSecondary">
          Публікації
        </Typography>
      </Divider>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <Typography
            variant="body1"
            color="textSecondary"
            textAlign="center"
            sx={{ mt: 4 }}
          >
            Цей користувач ще не зробив жодної публікації.
          </Typography>
        )}
      </Box>
    </Container>
  );
}
