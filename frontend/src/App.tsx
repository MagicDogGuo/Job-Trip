import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRoutes from '@/routes';
import store from '@/redux/store';
import { getCurrentUser } from '@/redux/slices/authSlice';

/**
 * 应用程序根组件
 * 提供主题和路由配置
 */
const App: React.FC = () => {
  // 应用启动时初始化全局状态
  useEffect(() => {
    // 如果本地有token，则尝试获取当前用户信息
    if (localStorage.getItem('token')) {
      store.dispatch(getCurrentUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
