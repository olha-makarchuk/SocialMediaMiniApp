import { Avatar, Box, Button, Card, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function UserCard({ user, isFollowing, onToggleFollow }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 2, borderRadius: 2 }}>
      <Avatar 
        src={user.avatar} 
        sx={{ width: 56, height: 56, cursor: 'pointer' }} 
        onClick={() => navigate(`/profile/${user.id}`)}
      />
      
      <Box sx={{ flexGrow: 1 }}>
        <Typography 
          variant="subtitle1" 
          fontWeight="bold" 
          sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          onClick={() => navigate(`/profile/${user.id}`)}
        >
          {user.name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          @{user.username}
        </Typography>
        {user.bio && (
          <Typography variant="body2" sx={{ mt: 0.5, fontSize: '0.85rem' }} noWrap>
            {user.bio}
          </Typography>
        )}
      </Box>

      <Stack direction="row" spacing={1} sx={{ textAlign: 'center', px: 2 }}>
        <Box>
          <Typography variant="body2" fontWeight="bold">{user.followersCount || 0}</Typography>
          <Typography variant="caption" color="textSecondary">Підписників</Typography>
        </Box>
      </Stack>

      <Button 
        variant={isFollowing ? "outlined" : "contained"}
        size="small"
        onClick={() => onToggleFollow(user.id)}
        sx={{ borderRadius: 5, textTransform: 'none', minWidth: 100 }}
      >
        {isFollowing ? "Відписатись" : "Підписатись"}
      </Button>
    </Card>
  );
}

export default UserCard;