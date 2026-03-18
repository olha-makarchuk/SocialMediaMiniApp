import { useSelector, useDispatch } from 'react-redux';
import { List, ListItem, ListItemText, ListItemIcon, IconButton, Typography, Box, Paper } from '@mui/material';
import { History, Close } from '@mui/icons-material';
import { selectSearchHistory } from '../../features/search/searchSelector';
import { removeFromHistory, clearHistory } from '../../features/search/searchSlice';

function SearchHistory({ onSelect }) {
  const history = useSelector(selectSearchHistory);
  const dispatch = useDispatch();

  if (history.length === 0) return null;

  return (
    <Paper sx={{ mt: 1, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" fontWeight="bold" color="textSecondary">
          ОСТАННІ ПОШУКИ
        </Typography>
        <Typography 
          variant="caption" 
          color="primary" 
          sx={{ cursor: 'pointer' }} 
          onClick={() => dispatch(clearHistory())}
        >
          Очистити все
        </Typography>
      </Box>
      <List dense sx={{ py: 0 }}>
        {history.map((item, index) => (
          <ListItem 
            key={index}
            secondaryAction={
              <IconButton edge="end" size="small" onClick={() => dispatch(removeFromHistory(item))}>
                <Close fontSize="inherit" />
              </IconButton>
            }
            sx={{ '&:hover': { bgcolor: 'action.selected' }, cursor: 'pointer' }}
          >
            <ListItemIcon sx={{ minWidth: 35 }} onClick={() => onSelect(item)}>
              <History fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item} onClick={() => onSelect(item)} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default SearchHistory;