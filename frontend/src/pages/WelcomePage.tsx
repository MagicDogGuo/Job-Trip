import React from 'react';
import { Link } from 'react-router-dom';
import { Download, ChevronRight, CheckCircle } from 'lucide-react';
import { useAppSelector } from '@/hooks/reduxHooks';

/**
 * 欢迎页面组件
 * 展示给登录用户的欢迎页面
 */
const WelcomePage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const userName = user?.firstName || user?.username || '用户';

  // 入门步骤数据
  const onboardingSteps = [
    {
      id: 1,
      title: '安装Chrome扩展',
      description: '获取JobTrip的chrome扩展，用于收藏职位、查看职位洞察和自动填写申请表。',
      status: 'pending',
      path: '/chrome-extension'
    },
    {
      id: 2,
      title: '将您的前3个职位保存到求职追踪器',
      description: '通过任何求职板或搜索引擎使用chrome扩展保存职位，或手动添加它们。',
      status: 'pending',
      path: '/job-search/2025'
    },
    {
      id: 3,
      title: '创建您的基础简历',
      description: '选择您的目标职位标题，并构建您的最佳基础简历。',
      status: 'pending',
      path: '/resume-builder'
    },
    {
      id: 4,
      title: '为特定职位调整您的简历',
      description: '一旦您创建了基础简历并收藏了一些职位，是时候制作为特定职位申请定制的简历了。',
      status: 'pending',
      path: '/resume-builder/customize'
    },
    {
      id: 5,
      title: '自动填写您的首个申请表',
      description: '安装chrome扩展并设置您的自动填写资料后，前往求职申请表，让JobTrip为您填写。',
      status: 'pending',
      path: '/auto-fill'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* 欢迎标语和愉快图案背景 */}
      <div className="relative mb-8 py-12 px-6 bg-indigo-50 rounded-xl dark:bg-indigo-900/20 overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute top-5 left-10 w-6 h-6 bg-yellow-300 rounded-full"></div>
          <div className="absolute top-20 right-20 w-8 h-8 bg-green-300 rounded"></div>
          <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-red-300 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-blue-300 transform rotate-45"></div>
          <div className="absolute top-1/3 left-1/2 w-7 h-7 bg-purple-300 rounded-lg"></div>
        </div>
        
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 dark:text-white">
            欢迎，{userName}！
          </h1>
          <div className="text-4xl md:text-6xl font-bold text-indigo-800 dark:text-indigo-300">
            Draven!
          </div>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl dark:text-gray-300">
            体验JobTrip的全部功能，完成下面的步骤来高效管理您的求职过程，提高成功率，加速您的职业发展。
          </p>
        </div>
      </div>

      {/* 入门步骤 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 dark:text-white">开始使用</h2>
        <div className="space-y-4">
          {onboardingSteps.map((step) => (
            <div 
              key={step.id} 
              className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    step.status === 'completed' 
                      ? 'border-green-500 bg-green-100 dark:bg-green-900/30' 
                      : 'border-indigo-500 bg-indigo-100 dark:bg-indigo-900/30'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{step.id}</span>
                    )}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-medium text-gray-900 mb-1 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 dark:text-gray-300">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.id === 1 && (
                      <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
                        <Download className="w-4 h-4 mr-1.5" />
                        下载Chrome扩展
                      </button>
                    )}
                    <Link 
                      to={step.path} 
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50"
                    >
                      开始 <ChevronRight className="w-4 h-4 ml-1.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage; 