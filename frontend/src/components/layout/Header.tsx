import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Button, 
  Box,
  useMediaQuery,
  Menu,
  MenuItem,
  Divider,
  Avatar
} from '@mui/material';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { logout } from '@/redux/slices/authSlice';

/**
 * 应用程序头部导航栏组件
 */
const Header: React.FC = () => {
  const { mode, toggleTheme } = useTheme(); // 使用主题上下文
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  
  // 菜单打开状态
  const open = Boolean(anchorEl);
  
  // 打开菜单
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // 关闭菜单
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 处理退出登录
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    navigate('/login');
  };
  
  // 获取用户显示名称
  const getUserDisplayName = () => {
    if (!user) return 'U';
    if (user.firstName) return user.firstName.charAt(0);
    if (user.username) return user.username.charAt(0);
    return 'U';
  };
  
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component={RouterLink} 
          to="/"
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          JobTrip 职途助手
        </Typography>
        
        {/* 桌面端导航 */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isAuthenticated && (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  仪表盘
                </Button>
                <Button color="inherit" component={RouterLink} to="/jobs">
                  职位列表
                </Button>
                <Button color="inherit" component={RouterLink} to="/stats">
                  数据统计
                </Button>
              </>
            )}
            
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{ ml: 1 }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {isAuthenticated ? (
              // 已登录：显示用户头像
              <IconButton
                edge="end"
                sx={{ ml: 2 }}
                onClick={handleMenuOpen}
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {getUserDisplayName()}
                </Avatar>
              </IconButton>
            ) : (
              // 未登录：显示登录按钮
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ ml: 2 }}
              >
                登录
              </Button>
            )}
          </Box>
        )}
        
        {/* 移动端菜单图标 */}
        {isMobile && (
          <>
            <IconButton 
              onClick={toggleTheme} 
              color="inherit"
              sx={{ ml: 1 }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            
            {isAuthenticated ? (
              // 已登录：显示菜单图标
              <IconButton
                edge="end"
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              // 未登录：显示登录按钮
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ ml: 1 }}
              >
                登录
              </Button>
            )}
          </>
        )}
        
        {/* 用户菜单 */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {isMobile && isAuthenticated && (
            <>
              <MenuItem component={RouterLink} to="/dashboard" onClick={handleMenuClose}>
                仪表盘
              </MenuItem>
              <MenuItem component={RouterLink} to="/jobs" onClick={handleMenuClose}>
                职位列表
              </MenuItem>
              <MenuItem component={RouterLink} to="/stats" onClick={handleMenuClose}>
                数据统计
              </MenuItem>
              <Divider />
            </>
          )}
          <MenuItem component={RouterLink} to="/profile" onClick={handleMenuClose}>
            个人设置
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            退出登录
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 