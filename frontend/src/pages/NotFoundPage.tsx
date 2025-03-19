import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * 404页面 - 当访问不存在的路由时显示
 */
const NotFoundPage: React.FC = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        py: 8,
      }}
    >
      <Typography variant="h1" component="h1" sx={{ mb: 2, fontSize: { xs: '4rem', md: '6rem' } }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        页面未找到
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: '600px' }}>
        您访问的页面不存在或已被移除。请检查URL是否正确，或返回首页继续浏览。
      </Typography>
      <Button variant="contained" component={RouterLink} to="/" size="large">
        返回首页
      </Button>
    </Box>
  );
};

export default NotFoundPage; 