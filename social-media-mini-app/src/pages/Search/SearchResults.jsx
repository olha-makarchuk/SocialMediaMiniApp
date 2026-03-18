import { useSelector } from 'react-redux';
import { selectFoundUsers, selectFoundPosts, selectSearchStatus } from '../../features/search/searchSelector';
import { List, ListItem, Avatar, ListItemAvatar, ListItemText, Divider, Box, CircularProgress } from '@mui/material';

export default function SearchResults() {
  const users = useSelector(selectFoundUsers);
  const posts = useSelector(selectFoundPosts);
  const status = useSelector(selectSearchStatus);

  if (status === 'loading') return <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress size={24} /></Box>;

  return (
    <Box sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 4, mt: 1, maxHeight: 400, overflowY: 'auto' }}>
      {users.length > 0 && (
        <List subheader={<Box sx={{ p: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>КОРИСТУВАЧІ</Box>}>
          {users.map(user => (
            <ListItem key={user.id} button>
              <ListItemAvatar>
                <Avatar src={user.avatar}>{user.name[0]}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={`@${user.username}`} />
            </ListItem>
          ))}
        </List>
      )}
      
      {users.length > 0 && posts.length > 0 && <Divider />}

      {posts.length > 0 && (
        <List subheader={<Box sx={{ p: 1, fontWeight: 'bold', fontSize: '0.8rem' }}>ПОСТИ</Box>}>
          {posts.map(post => (
            <ListItem key={post.id} button>
              <ListItemText 
                primary={post.content.substring(0, 40) + '...'} 
                secondary={new Date(post.createdAt).toLocaleDateString()} 
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}