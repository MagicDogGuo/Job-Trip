import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Sparkles, 
  Zap, 
  Chrome, 
  User, 
  Users, 
  File, 
  Plus,
  Star
} from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';

/**
 * 侧边栏导航组件
 * 登录后显示
 */
const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.auth);

  // 检查当前路径是否匹配给定的路径
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // 主菜单项
  const mainMenuItems = [
    { 
      name: '欢迎', 
      path: '/welcome', 
      icon: <Home className="w-5 h-5" /> 
    },
    { 
      name: '简历生成器', 
      path: '/resume-builder', 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      name: 'AI求职信和更多', 
      path: '/cover-letters', 
      icon: <Sparkles className="w-5 h-5" /> 
    },
    { 
      name: '自动填表', 
      path: '/auto-fill', 
      icon: <Zap className="w-5 h-5" /> 
    },
    { 
      name: 'Chrome扩展', 
      path: '/chrome-extension', 
      icon: <Chrome className="w-5 h-5" /> 
    }
  ];

  // 二级菜单项
  const secondaryMenuItems = [
    { 
      name: '个人资料', 
      path: '/profile', 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      name: '联系人', 
      path: '/contacts', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: '文档', 
      path: '/documents', 
      icon: <File className="w-5 h-5" /> 
    }
  ];

  // 用户创建的工作追踪器
  const jobTrackers = [
    { name: '求职搜索 2025', path: '/job-search/2025' }
  ];

  return (
    <div className="fixed inset-y-0 left-0 z-10 flex-shrink-0 w-64 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 hidden md:block">
      <div className="flex flex-col h-full">
        {/* 顶部Logo区域 */}
        <div className="px-4 py-5">
          <div className="flex items-center">
            <div className="p-1.5 bg-indigo-100 rounded dark:bg-indigo-900">
              <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">JobTrip</span>
          </div>
        </div>

        {/* 主菜单 */}
        <div className="flex-grow px-4 py-2 space-y-1 overflow-y-auto">
          {mainMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.icon}
              </div>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}

          {/* 分割线 */}
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

          {/* 二级菜单 */}
          {secondaryMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                isActive(item.path)
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>
                {item.icon}
              </div>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}

          {/* 分割线 */}
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

          {/* 工作追踪器部分 */}
          <div className="mb-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">我的求职追踪器</h3>
              <button className="p-1 text-gray-500 rounded hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {jobTrackers.map((tracker, index) => (
              <Link
                key={index}
                to={tracker.path}
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg ${
                  isActive(tracker.path)
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-100'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-center w-5 h-5 text-white bg-indigo-600 rounded-full dark:bg-indigo-500">
                  <span className="text-xs">{index + 1}</span>
                </div>
                <span className="ml-3">{tracker.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 底部升级区域 */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="p-3 bg-indigo-50 rounded-lg dark:bg-indigo-900/30">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-sm font-medium text-indigo-800 dark:text-indigo-200">JobTrip Pro</span>
            </div>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">提升您的求职搜索体验</p>
            <button className="w-full px-3 py-1.5 mt-2 text-xs font-medium text-center text-white bg-indigo-600 rounded hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              立即升级
            </button>
          </div>
        </div>

        {/* 用户信息区域 */}
        <div className="flex items-center p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center w-8 h-8 text-white bg-indigo-600 rounded-full">
            {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-800 dark:text-white">
              {user?.firstName || user?.username || '用户'}
            </p>
            <Link to="/settings" className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              设置
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 