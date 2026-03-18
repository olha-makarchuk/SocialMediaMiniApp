import { useNavigate } from 'react-router-dom'; 
import { IconButton, Box, Container } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PostCard from "./PostCard";

function PostList({ posts }) {
  const navigate = useNavigate();

  const handleCreateRedirect = () => {
    navigate('/create-post'); 
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        mb: 2, 
        mt: 2 
      }}>
        <IconButton 
          aria-label="go-to-create-post" 
          color="primary"
          onClick={handleCreateRedirect} 
          sx={{ 
            width: 56, 
            height: 56,
            '&:hover': {
              transform: 'scale(1.1)'
            },
            transition: 'all 0.2s'
          }}
        >
          <AddCircleIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>

      <Box>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </Box>
    </Container>
  );
}

export default PostList;