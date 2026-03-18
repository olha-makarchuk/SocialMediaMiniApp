import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle 
} from '@mui/material';

function DeleteConfirmDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Видалити цей пост?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Ви впевнені, що хочете видалити цей запис? Цю дію неможливо буде скасувати.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 2, px: 2 }}>
        <Button onClick={onClose} color="primary" variant="outlined">
          Скасувати
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmDialog;