import React from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Switch, FormControlLabel, Divider } from '@mui/material';

/**
 * 个人设置页面组件
 */
const ProfilePage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        个人设置
      </Typography>
      <Typography variant="body1" paragraph>
        管理您的个人信息和偏好设置。
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          个人信息
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="姓名"
              defaultValue="示例用户"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="邮箱"
              defaultValue="example@example.com"
              margin="normal"
              type="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="职业"
              defaultValue="软件工程师"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              保存更改
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          密码修改
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="当前密码"
              type="password"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="新密码"
              type="password"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="确认新密码"
              type="password"
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              更新密码
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          通知设置
        </Typography>
        <Box>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="申请状态更新通知"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="面试提醒"
          />
        </Box>
        <Box>
          <FormControlLabel
            control={<Switch />}
            label="新职位推荐"
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Button variant="contained" color="primary">
          保存设置
        </Button>
      </Paper>
    </Box>
  );
};

export default ProfilePage; 