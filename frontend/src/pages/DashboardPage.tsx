import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

/**
 * 仪表盘页面组件
 */
const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        仪表盘
      </Typography>
      <Typography variant="body1" paragraph>
        欢迎回来！这里是您的求职数据概览。
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              backgroundColor: theme => theme.palette.primary.main,
              color: 'white'
            }}
          >
            <Typography variant="h5">10</Typography>
            <Typography variant="subtitle1">申请中</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              backgroundColor: theme => theme.palette.info.main,
              color: 'white'
            }}
          >
            <Typography variant="h5">5</Typography>
            <Typography variant="subtitle1">面试中</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              backgroundColor: theme => theme.palette.success.main,
              color: 'white'
            }}
          >
            <Typography variant="h5">2</Typography>
            <Typography variant="subtitle1">已录用</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper 
            sx={{ 
              p: 3, 
              textAlign: 'center',
              backgroundColor: theme => theme.palette.error.main,
              color: 'white'
            }}
          >
            <Typography variant="h5">3</Typography>
            <Typography variant="subtitle1">已拒绝</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          近期活动
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            暂无活动记录
          </Typography>
        </Paper>
      </Box>
      
      <Box>
        <Typography variant="h5" gutterBottom>
          近期面试
        </Typography>
        <Paper sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            暂无面试安排
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage; 