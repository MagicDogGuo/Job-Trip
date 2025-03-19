import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/reduxHooks';
import { getCurrentUser } from '@/redux/slices/authSlice';
import Loader from '@/components/common/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 路由保护组件
 * 用于保护需要登录才能访问的路由
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, token, user } = useAppSelector((state) => state.auth);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    // 如果有token但还没有验证过用户信息或没有用户信息，则获取用户信息
    if (token && (!isAuthenticated || !user) && !isLoading && !isValidating) {
      setIsValidating(true);
      dispatch(getCurrentUser())
        .unwrap()
        .catch(() => {
          // 如果获取用户信息失败，移除token
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsValidating(false);
        });
    }
  }, [token, isAuthenticated, isLoading, dispatch, user, isValidating]);

  // 如果正在加载，显示加载中
  if (isLoading || isValidating) {
    return <Loader message="验证登录状态..." fullScreen />;
  }

  // 如果未登录，重定向到登录页面，并记录当前尝试访问的路径
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 已登录，正常显示子组件
  return <>{children}</>;
};

export default ProtectedRoute; 