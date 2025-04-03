import React, { useState } from 'react';
import { Plus, Download, Settings, HelpCircle, UserPlus, Building, MapPin, Phone, Mail, Calendar, Clock, Briefcase, GraduationCap, Award, ToggleLeft, Bell, Shield, Database, Trash2 } from 'lucide-react';

/**
 * 自动填表功能页面组件
 * 用于管理用户自动填表的个人资料和设置
 */
const AutoFillPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'个人信息' | '工作经历' | '教育经历' | '技能' | '设置'>('个人信息');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">自动填表</h1>
        <p className="text-gray-600 dark:text-gray-300">
          节省时间，避免重复输入。使用JobTrip的Chrome扩展自动填写求职申请表。
        </p>
      </div>

      {/* Chrome扩展下载提示 */}
      <div className="mb-8 bg-indigo-50 rounded-lg p-6 border border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="flex-grow mb-4 sm:mb-0">
            <h2 className="text-lg font-medium text-gray-900 mb-2 dark:text-white">安装Chrome扩展</h2>
            <p className="text-gray-600 dark:text-gray-300">
              启用自动填表功能，您需要先安装JobTrip的Chrome浏览器扩展
            </p>
          </div>
          <button className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
            <Download className="w-4 h-4 mr-2" />
            下载Chrome扩展
          </button>
        </div>
      </div>

      {/* 标签切换导航 */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex flex-wrap -mb-px">
            {(['个人信息', '工作经历', '教育经历', '技能', '设置'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-400 dark:hover:border-gray-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 个人信息标签内容 */}
      {activeTab === '个人信息' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">个人信息</h2>
            <div className="flex space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 个人基本信息 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">基本信息</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <UserPlus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">姓名</div>
                    <div className="text-gray-900 dark:text-white">张三</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <Building className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">当前/最近公司</div>
                    <div className="text-gray-900 dark:text-white">ABC科技有限公司</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">职位头衔</div>
                    <div className="text-gray-900 dark:text-white">高级前端开发工程师</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">地址</div>
                    <div className="text-gray-900 dark:text-white">上海市浦东新区张江高科技园区</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
              </div>
            </div>
            
            {/* 个人联系方式 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">联系方式</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">电话</div>
                    <div className="text-gray-900 dark:text-white">+86 138 **** 1234</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">电子邮箱</div>
                    <div className="text-gray-900 dark:text-white">zhangsan@example.com</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">生日</div>
                    <div className="text-gray-900 dark:text-white">1990-01-01</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-10">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-grow">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">最佳联系时间</div>
                    <div className="text-gray-900 dark:text-white">工作日 9:00-18:00</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 工作经历标签内容 */}
      {activeTab === '工作经历' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">工作经历</h2>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              <Plus className="w-4 h-4 mr-1.5" />
              添加工作经历
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 工作经历项目 */}
            <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                      <Building className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">ABC科技有限公司</h3>
                    <p className="text-gray-600 dark:text-gray-300">高级前端开发工程师</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2020年6月 - 至今 · 上海</p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">工作职责与成就</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 dark:text-gray-400">
                        <li>负责公司主要产品的前端架构设计和开发</li>
                        <li>带领5人团队完成了新版UI界面的重构，提升了30%的用户交互体验</li>
                        <li>优化了前端构建流程，将构建时间从3分钟减少到45秒</li>
                        <li>设计并实现了组件库，提高了团队开发效率</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <HelpCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 justify-end">
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  编辑
                </button>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  删除
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                      <Building className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">XYZ创新科技公司</h3>
                    <p className="text-gray-600 dark:text-gray-300">前端开发工程师</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2018年3月 - 2020年5月 · 北京</p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">工作职责与成就</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 dark:text-gray-400">
                        <li>参与开发多个企业级Web应用</li>
                        <li>负责将传统jQuery应用迁移到React框架，提升了应用性能</li>
                        <li>实现了自动化测试，覆盖率达到85%</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 justify-end">
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  编辑
                </button>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 教育经历标签内容 */}
      {activeTab === '教育经历' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">教育经历</h2>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              <Plus className="w-4 h-4 mr-1.5" />
              添加教育经历
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 教育经历项目 */}
            <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                      <GraduationCap className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">清华大学</h3>
                    <p className="text-gray-600 dark:text-gray-300">计算机科学与技术，硕士</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2015年9月 - 2018年6月</p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">课程与成就</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 dark:text-gray-400">
                        <li>主修课程：高级算法、分布式系统、机器学习</li>
                        <li>GPA: 3.8/4.0</li>
                        <li>毕业论文：《基于深度学习的代码自动补全系统》</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 justify-end">
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  编辑
                </button>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  删除
                </button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                      <GraduationCap className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">北京大学</h3>
                    <p className="text-gray-600 dark:text-gray-300">计算机科学与技术，学士</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">2011年9月 - 2015年6月</p>
                    
                    <div className="mt-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">课程与成就</h4>
                      <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 dark:text-gray-400">
                        <li>主修课程：数据结构、计算机网络、操作系统</li>
                        <li>获得校级优秀学生奖学金两次</li>
                        <li>参与ACM程序设计大赛并获得校级一等奖</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex space-x-2 justify-end">
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  编辑
                </button>
                <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 技能标签内容 */}
      {activeTab === '技能' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">技能</h2>
            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600">
              <Plus className="w-4 h-4 mr-1.5" />
              添加技能
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 技术技能 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">技术技能</h3>
              <div className="flex flex-wrap gap-2">
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  JavaScript
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  TypeScript
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  React
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  Vue.js
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  Node.js
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  HTML5/CSS3
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  Webpack
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-indigo-900/30 dark:text-indigo-400">
                  Git
                </div>
              </div>
            </div>
            
            {/* 语言技能 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">语言技能</h3>
              <div className="flex flex-wrap gap-2">
                <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                  中文（母语）
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                  英语（流利）
                </div>
                <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium dark:bg-green-900/30 dark:text-green-400">
                  日语（基础）
                </div>
              </div>
            </div>
            
            {/* 证书与资质 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">证书与资质</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                      <Award className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">AWS认证解决方案架构师（专业级）</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">发证方：Amazon Web Services • 2022年获得</p>
                  </div>
                  <button className="ml-auto text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center dark:bg-gray-700">
                      <Award className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Google认证专业前端开发工程师</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">发证方：Google • 2021年获得</p>
                  </div>
                  <button className="ml-auto text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 设置标签内容 */}
      {activeTab === '设置' && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">自动填表设置</h2>
          </div>
          
          <div className="space-y-8">
            {/* 通用设置 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">通用设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">启用自动填表</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">允许Chrome扩展在求职申请表单中自动填入您的信息</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ToggleLeft className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">填表前询问</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">在自动填写表单前弹出确认对话框</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ToggleLeft className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">保存申请历史</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">记录您通过自动填表提交的所有申请</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ToggleLeft className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 隐私设置 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">隐私设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">敏感信息加密</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">加密存储您的敏感个人信息</p>
                  </div>
                  <button className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                    <Shield className="w-8 h-8" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">允许数据分析</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">允许JobTrip分析您的求职数据以提供个性化建议</p>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ToggleLeft className="w-8 h-8" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 数据管理 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">数据管理</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">导出所有数据</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">将您的所有个人资料数据导出为JSON格式</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                    <Database className="w-4 h-4 mr-1.5" />
                    导出数据
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">清除所有数据</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">永久删除所有保存的自动填表信息</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    清除数据
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoFillPage; 