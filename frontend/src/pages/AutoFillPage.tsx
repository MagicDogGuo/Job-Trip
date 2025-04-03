import React, { useState } from 'react';
import { Plus, Download, Settings, HelpCircle, UserPlus, Building, MapPin, Phone, Mail, Calendar, Clock, Briefcase, GraduationCap, Award, ToggleLeft, Bell, Shield, Database, Trash2 } from 'lucide-react';

/**
 * 自动填表功能页面组件
 * 用于管理用户自动填表的个人资料和设置
 */
const AutoFillPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'个人信息' | '工作经历' | '教育经历' | '技能' | '设置'>('个人信息');

  return (
    <div className="container-lg">
      <div className="section">
        <h1 className="title-lg">自动填表</h1>
        <p className="text-description">
          节省时间，避免重复输入。使用JobTrip的Chrome扩展自动填写求职申请表。
        </p>
      </div>

      {/* Chrome扩展下载提示 */}
      <div className="autofill-extension-banner">
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="flex-grow mb-4 sm:mb-0">
            <h2 className="title-sm mb-2">安装Chrome扩展</h2>
            <p className="text-description">
              启用自动填表功能，您需要先安装JobTrip的Chrome浏览器扩展
            </p>
          </div>
          <button className="btn btn-primary">
            <Download className="w-4 h-4 mr-2" />
            下载Chrome扩展
          </button>
        </div>
      </div>

      {/* 标签切换导航 */}
      <div className="mb-6">
        <div className="tabs">
          {(['个人信息', '工作经历', '教育经历', '技能', '设置'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${
                activeTab === tab
                  ? 'tab-active'
                  : 'tab-inactive'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 个人信息标签内容 */}
      {activeTab === '个人信息' && (
        <div className="autofill-tab-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-md">个人信息</h2>
            <div className="flex space-x-2">
              <button className="header-action-button">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="header-action-button">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="grid-cols-1-2">
            {/* 个人基本信息 */}
            <div>
              <h3 className="title-sm mb-4">基本信息</h3>
              <div className="space-y-4">
                <div className="data-item">
                  <div className="data-item-icon">
                    <UserPlus className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">姓名</div>
                    <div className="data-item-value">张三</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Building className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">当前/最近公司</div>
                    <div className="data-item-value">ABC科技有限公司</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">职位头衔</div>
                    <div className="data-item-value">高级前端开发工程师</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <MapPin className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">地址</div>
                    <div className="data-item-value">上海市浦东新区张江高科技园区</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
              </div>
            </div>
            
            {/* 个人联系方式 */}
            <div>
              <h3 className="title-sm mb-4">联系方式</h3>
              <div className="space-y-4">
                <div className="data-item">
                  <div className="data-item-icon">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">电话</div>
                    <div className="data-item-value">+86 138 **** 1234</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">电子邮箱</div>
                    <div className="data-item-value">zhangsan@example.com</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">生日</div>
                    <div className="data-item-value">1990-01-01</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">最佳联系时间</div>
                    <div className="data-item-value">工作日 9:00-18:00</div>
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
        <div className="autofill-tab-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-md">工作经历</h2>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              添加工作经历
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 工作经历卡片1 */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="title-sm">高级前端开发工程师</h3>
                  <p className="text-description">ABC科技有限公司 · 上海</p>
                  <p className="text-description">2020年6月 - 至今 · 3年2个月</p>
                </div>
                <button className="btn btn-outline-sm">编辑</button>
              </div>
              <div className="card-body">
                <p className="mb-4">
                  负责公司核心产品的前端开发与维护，参与产品需求分析和技术方案设计，推动产品迭代更新。
                </p>
                <ul className="list-disc list-inside text-description">
                  <li>使用React、TypeScript和Tailwind CSS重构旧版UI，提升用户体验</li>
                  <li>优化前端性能，将页面加载时间缩短40%</li>
                  <li>设计并实现了组件库，提高了团队开发效率</li>
                  <li>指导初级开发人员，提供代码审查和技术指导</li>
                </ul>
              </div>
            </div>
            
            {/* 工作经历卡片2 */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="title-sm">前端开发工程师</h3>
                  <p className="text-description">XYZ创新科技 · 北京</p>
                  <p className="text-description">2018年3月 - 2020年5月 · 2年3个月</p>
                </div>
                <button className="btn btn-outline-sm">编辑</button>
              </div>
              <div className="card-body">
                <p className="mb-4">
                  参与公司电商平台的前端开发，负责用户界面实现和功能开发。
                </p>
                <ul className="list-disc list-inside text-description">
                  <li>使用Vue.js开发响应式用户界面</li>
                  <li>实现了购物车和支付流程的前端功能</li>
                  <li>与后端团队合作优化API设计和数据处理</li>
                  <li>参与用户测试和Bug修复，提高产品质量</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 教育经历标签内容 */}
      {activeTab === '教育经历' && (
        <div className="autofill-tab-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-md">教育经历</h2>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              添加教育经历
            </button>
          </div>
          
          <div className="space-y-6">
            {/* 教育经历卡片1 */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="title-sm">上海交通大学</h3>
                  <p className="text-description">计算机科学与技术 · 硕士学位</p>
                  <p className="text-description">2015年9月 - 2018年6月</p>
                </div>
                <button className="btn btn-outline-sm">编辑</button>
              </div>
              <div className="card-body">
                <p className="mb-4">
                  主修计算机科学与技术，专注于Web开发和用户界面设计。
                </p>
                <ul className="list-disc list-inside text-description">
                  <li>GPA: 3.8/4.0</li>
                  <li>获得校级优秀毕业生称号</li>
                  <li>参与多个创新项目，获得创新创业大赛二等奖</li>
                  <li>研究方向：前端框架性能优化</li>
                </ul>
              </div>
            </div>
            
            {/* 教育经历卡片2 */}
            <div className="card">
              <div className="card-header">
                <div>
                  <h3 className="title-sm">北京大学</h3>
                  <p className="text-description">软件工程 · 学士学位</p>
                  <p className="text-description">2011年9月 - 2015年6月</p>
                </div>
                <button className="btn btn-outline-sm">编辑</button>
              </div>
              <div className="card-body">
                <p className="mb-4">
                  主修软件工程，学习了编程基础、数据结构、算法和软件开发方法。
                </p>
                <ul className="list-disc list-inside text-description">
                  <li>GPA: 3.7/4.0</li>
                  <li>获得奖学金三次</li>
                  <li>参与学生技术社团，担任Web开发小组组长</li>
                  <li>毕业设计：基于React的在线教育平台</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 技能标签内容 */}
      {activeTab === '技能' && (
        <div className="autofill-tab-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-md">技能</h2>
            <button className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              添加技能
            </button>
          </div>
          
          <div className="space-y-8">
            {/* 技术技能 */}
            <div>
              <h3 className="title-sm mb-4">技术技能</h3>
              <div className="grid-cols-1-2 gap-y-4">
                <div className="data-item">
                  <div className="data-item-icon">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">前端开发</div>
                    <div className="data-item-value">React, Vue, Angular, JavaScript, TypeScript</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">UI/UX</div>
                    <div className="data-item-value">CSS, SASS, Tailwind, Bootstrap, Figma</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">后端技术</div>
                    <div className="data-item-value">Node.js, Express, MongoDB, SQL</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">开发工具</div>
                    <div className="data-item-value">Git, Webpack, Jest, Docker</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
              </div>
            </div>
            
            {/* 语言技能 */}
            <div>
              <h3 className="title-sm mb-4">语言技能</h3>
              <div className="grid-cols-1-2 gap-y-4">
                <div className="data-item">
                  <div className="data-item-icon">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">中文</div>
                    <div className="data-item-value">母语</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    编辑
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Award className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">英语</div>
                    <div className="data-item-value">流利 (TOEFL 105)</div>
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
      
      {/* 设置标签内容 */}
      {activeTab === '设置' && (
        <div className="autofill-tab-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="title-md">自动填表设置</h2>
          </div>
          
          <div className="space-y-8">
            {/* 自动填表设置 */}
            <div>
              <h3 className="title-sm mb-4">填表偏好</h3>
              <div className="space-y-4">
                <div className="data-item">
                  <div className="data-item-icon">
                    <ToggleLeft className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">自动填写个人信息</div>
                    <div className="data-item-value">开启</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    修改
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Bell className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">识别到表单时通知</div>
                    <div className="data-item-value">开启</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    修改
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Shield className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">填表前确认</div>
                    <div className="data-item-value">开启</div>
                  </div>
                  <button className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                    修改
                  </button>
                </div>
              </div>
            </div>
            
            {/* 数据管理 */}
            <div>
              <h3 className="title-sm mb-4">数据管理</h3>
              <div className="space-y-4">
                <div className="data-item">
                  <div className="data-item-icon">
                    <Database className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">导出个人数据</div>
                    <div className="data-item-value">下载所有填表数据的备份</div>
                  </div>
                  <button className="btn btn-outline-sm">
                    导出
                  </button>
                </div>
                
                <div className="data-item">
                  <div className="data-item-icon">
                    <Trash2 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="data-item-content">
                    <div className="data-item-label">删除所有数据</div>
                    <div className="data-item-value">永久删除所有个人信息和设置</div>
                  </div>
                  <button className="btn btn-danger-sm">
                    删除
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