import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Container,
  TextField,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { fetchUsersAsync, followUserAsync, unfollowUserAsync } from "../../features/users/usersApi";
import {
  selectAllUsersList,
  selectUsersStatus,
} from "../../features/users/usersSelector";
import UserCard from "./UserCard";

function UserList() {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsersList);
  const currentUser = useSelector((state) => state.auth.user);
  const status = useSelector(selectUsersStatus);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsersAsync());
    }
  }, [dispatch, status]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const recommendedUsers = users.slice(0, 3);

  const handleFollowToggle = (followedId) => {
    const isFollowing = users.find((u) => u.id === followedId)?.isFollowing;
    const payload = { userid: currentUser.id, followedUserId: followedId };

    if (isFollowing) {
      dispatch(unfollowUserAsync(payload));
    } else {
      dispatch(followUserAsync(payload));
    }
  };

  if (status === "loading" && users.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Пошук користувачів
      </Typography>

      <TextField
        fullWidth
        placeholder="Введіть ім'я або username..."
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 4, bgcolor: "background.paper" }}
      />

      {searchQuery === "" && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h6"
            color="primary"
            fontWeight="bold"
            gutterBottom
          >
            Recommended users
          </Typography>
          {recommendedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              isFollowing={user.isFollowing}
              onToggleFollow={handleFollowToggle}
            />
          ))}
          <Divider sx={{ my: 4 }} />
        </Box>
      )}

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {searchQuery
          ? `Результати пошуку (${filteredUsers.length})`
          : "Усі користувачі"}
      </Typography>

      {filteredUsers.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isFollowing={user.isFollowing}
          onToggleFollow={handleFollowToggle}
        />
      ))}

      {filteredUsers.length === 0 && (
        <Typography color="textSecondary" sx={{ textAlign: "center", mt: 4 }}>
          Користувачів не знайдено
        </Typography>
      )}
    </Container>
  );
}

export default UserList;
