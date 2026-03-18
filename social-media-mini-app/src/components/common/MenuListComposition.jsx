import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MoreVert, Edit, Delete } from '@mui/icons-material';

const PostMenu = ({ onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const handleAction = (event, callback) => {
    event.stopPropagation();
    if (callback) callback();
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="post-menu-button"
        aria-controls={open ? 'post-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVert />
      </IconButton>
      <Menu
        id="post-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'post-menu-button',
        }}
      >
        <MenuItem onClick={(e) => handleAction(e, onEdit)}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Редагувати</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={(e) => handleAction(e, onDelete)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Видалити</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PostMenu;