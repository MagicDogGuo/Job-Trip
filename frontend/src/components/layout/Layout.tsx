import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAppSelector } from '@/hooks/reduxHooks';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 应用程序主布局组件
 * 包含页眉和页脚，负责整体页面布局
 * 登录后使用左侧边栏布局
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // 未登录用户显示标准布局（顶部导航）
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </div>
    );
  }
  
  // 已登录用户显示侧边栏布局
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 w-full ml-0 md:ml-64">
        <Header />
        <main className="flex-grow p-6 pt-20 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 