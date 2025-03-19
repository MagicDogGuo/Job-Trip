import React from 'react';
import { Typography, Box, Paper, Grid, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * 应用程序首页组件
 */
const HomePage: React.FC = () => {
  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', width: '100%' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          欢迎使用 JobTrip 职途助手
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          高效管理你的求职旅程，掌握每一个就业机会
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={RouterLink}
            to="/dashboard"
            sx={{ mx: 1 }}
          >
            进入仪表盘
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={RouterLink}
            to="/jobs"
            sx={{ mx: 1 }}
          >
            查看职位
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              追踪申请进度
            </Typography>
            <Typography variant="body1">
              轻松记录和跟踪每个职位申请的状态，从初次申请到最终录用，全程可视化管理。
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              数据分析洞察
            </Typography>
            <Typography variant="body1">
              通过直观的图表和统计数据，分析你的求职效率和成功率，优化未来的申请策略。
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              提高求职效率
            </Typography>
            <Typography variant="body1">
              自动化记录，智能提醒，让你的求职过程更加高效、有序，不错过任何重要机会。
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HomePage; 