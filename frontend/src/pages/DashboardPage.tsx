import React, { useState } from 'react';
import { BriefcaseIcon, PlusCircle, Filter, Search, BellIcon, CalendarIcon, PieChartIcon, MoreHorizontal, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * 仪表盘页面组件
 */
const DashboardPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">职位追踪</h1>
        <p className="text-gray-600 dark:text-gray-300">
          管理您的求职过程，跟踪每个职位的申请状态和进度。
        </p>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
              <BriefcaseIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">20</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">总申请数</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">5</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">本周面试</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <PieChartIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">18%</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">面试转化率</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
              <BellIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">3</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">待处理任务</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="搜索职位..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
            <Filter className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            筛选
          </button>
          <Link to="/jobs/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            <PlusCircle className="mr-2 h-5 w-5" />
            添加职位
          </Link>
        </div>
      </div>
      
      {/* 看板视图 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 待申请列 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white">待申请</span>
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">5</span>
            </div>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">高级前端工程师</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">腾讯</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded">远程</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">¥30-45K/月</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">全栈开发工程师</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">阿里巴巴</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-0.5 rounded">混合办公</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">¥25-40K/月</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">产品经理</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">字节跳动</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-0.5 rounded">全职</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">¥35-50K/月</span>
              </div>
            </div>
            <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              添加职位
            </button>
          </div>
        </div>
        
        {/* 已申请列 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white">已申请</span>
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">3</span>
            </div>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">iOS开发工程师</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">小米</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-0.5 rounded">北京</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">¥20-35K/月</span>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">后端开发工程师</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">网易</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-2 py-0.5 rounded">杭州</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">¥25-40K/月</span>
              </div>
            </div>
            <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              添加职位
            </button>
          </div>
        </div>
        
        {/* 面试中列 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 dark:text-white">面试中</span>
              <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full">2</span>
            </div>
            <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <div className="p-4 space-y-3">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-medium text-gray-900 dark:text-white">算法工程师</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">百度</p>
              <div className="mt-2 flex items-center">
                <span className="text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-2 py-0.5 rounded">上海</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">¥30-50K/月</span>
              </div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">下一轮面试: 明天 14:00</div>
            </div>
            <button className="w-full py-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Plus className="h-4 w-4 mr-1" />
              添加职位
            </button>
          </div>
        </div>
      </div>
      
      {/* 近期面试提醒 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-8 border border-gray-100 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-medium text-gray-900 dark:text-white">近期面试安排</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">百度 - 算法工程师</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">明天 14:00-15:30</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">技术面试（第二轮）</p>
              </div>
              <div className="ml-auto text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  已确认
                </span>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 dark:bg-blue-900 p-2.5 rounded-full">
                  <CalendarIcon className="h-5 w-5 text-blue-700 dark:text-blue-300" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">阿里巴巴 - 前端开发工程师</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">后天 10:00-11:30</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">技术面试（第一轮）</p>
              </div>
              <div className="ml-auto text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  待确认
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 