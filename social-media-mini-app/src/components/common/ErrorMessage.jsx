import { Alert, AlertTitle, Collapse, Box } from '@mui/material';

function ErrorMessage({ error }) {
  if (!error) return null;

  const message = typeof error === 'object' ? error.message || JSON.stringify(error) : error;

  return (
    <Box sx={{ width: '100%', my: 2 }}>
      <Collapse in={!!error}>
        <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>
          <AlertTitle>Помилка</AlertTitle>
          {message}
        </Alert>
      </Collapse>
    </Box>
  );
}

export default ErrorMessage;