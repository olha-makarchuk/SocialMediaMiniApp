import { Stack, Box, Typography } from '@mui/material';

function UserStats({ posts, followers, following, vertical = false }) {
  const stats = [
    { label: 'Пости', value: posts },
    { label: 'Підписники', value: followers },
    { label: 'Підписки', value: following },
  ];

  return (
    <Stack 
      direction={vertical ? "column" : "row"} 
      spacing={vertical ? 1 : 4} 
      sx={{ width: '100%' }}
    >
      {stats.map((stat) => (
        <Box key={stat.label} sx={{ textAlign: vertical ? 'left' : 'center' }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {stat.value || 0}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {stat.label}
          </Typography>
        </Box>
      ))}
    </Stack>
  );
}

export default UserStats;