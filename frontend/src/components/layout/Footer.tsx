import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

/**
 * 应用程序页脚组件
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          {currentYear}
          {' '}
          <Link color="inherit" href="/">
            JobTrip 职途助手
          </Link>
          {' - 404 Not Found 团队开发'}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 