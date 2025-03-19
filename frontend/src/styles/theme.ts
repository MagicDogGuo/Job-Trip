import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// 自定义调色板
const primaryColor = {
  main: '#3f51b5', // 主色调
  light: '#757de8',
  dark: '#002984',
  contrastText: '#ffffff',
};

const secondaryColor = {
  main: '#f50057', // 次要色调
  light: '#ff5983',
  dark: '#bb002f',
  contrastText: '#ffffff',
};

// 创建浅色主题
export const lightTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'light',
      primary: primaryColor,
      secondary: secondaryColor,
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
    },
  })
);

// 创建深色主题
export const darkTheme = responsiveFontSizes(
  createTheme({
    palette: {
      mode: 'dark',
      primary: primaryColor,
      secondary: secondaryColor,
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
          },
        },
      },
    },
  })
); 