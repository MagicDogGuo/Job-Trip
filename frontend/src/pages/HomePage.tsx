import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { BriefcaseIcon, ChevronRight, PlayCircle, Calendar, FileText, Search, Plus, ArrowRight } from 'lucide-react';

/**
 * 应用程序首页组件
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h1 className="text-4xl lg:text-5xl font-bold text-[#1E1B4B] mb-6 leading-tight">
                  更少麻烦，<br />
                  <span className="text-[#6366F1] relative">
                    更多
                    <img src="https://via.placeholder.com/40x40/F9A8D4/FFFFFF/?text=★" alt="" className="absolute -top-10 -right-12 w-10 h-10 rotate-12" />
                    <img src="https://via.placeholder.com/30x30/A7F3D0/FFFFFF/?text=●" alt="" className="absolute -left-10 bottom-0 w-8 h-8" />
                  </span><br />
                  面试机会
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  JobTrip助您快速创建量身定制的简历和求职信，一键填写申请表格，并智能组织您的求职过程。
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <RouterLink to="/register" className="bg-[#6366F1] text-white px-6 py-3 rounded-lg hover:bg-[#4F46E5] transition-colors flex items-center justify-center">
                    免费注册
                  </RouterLink>
                  <button className="bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                    <PlayCircle className="mr-2" size={20} />
                    观看演示
                  </button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="bg-[#F0F0FF] rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <BriefcaseIcon className="text-[#6366F1]" size={20} />
                        <span className="font-semibold text-gray-700">职位搜索 2023</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-xs py-1 px-2 bg-gray-100 rounded-md hover:bg-gray-200">筛选</button>
                        <button className="text-xs py-1 px-2 bg-[#6366F1] text-white rounded-md">看板</button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-500">待申请</span>
                          <span className="text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded">3</span>
                        </div>
                        <div className="flex justify-center mb-2">
                          <button className="w-full py-1 border border-dashed border-gray-300 rounded-md text-gray-400 flex items-center justify-center">
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="bg-white p-2 border border-gray-100 rounded-md mb-2 shadow-sm">
                          <div className="text-xs font-medium">高级工程师</div>
                          <div className="text-xs text-[#6366F1]">腾讯</div>
                        </div>
                        <div className="bg-white p-2 border border-gray-100 rounded-md shadow-sm">
                          <div className="text-xs font-medium">前端开发</div>
                          <div className="text-xs text-[#6366F1]">阿里巴巴</div>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-500">已申请</span>
                          <span className="text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded">3</span>
                        </div>
                        <div className="bg-white p-2 border border-gray-100 rounded-md mb-2 shadow-sm">
                          <div className="text-xs font-medium">iOS工程师</div>
                          <div className="text-xs text-orange-500">Apple</div>
                        </div>
                        <div className="flex justify-center mb-2">
                          <button className="w-full py-1 border border-dashed border-gray-300 rounded-md text-gray-400 flex items-center justify-center">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-medium text-gray-500">面试</span>
                          <span className="text-xs font-medium bg-gray-100 px-1.5 py-0.5 rounded">2</span>
                        </div>
                        <div className="bg-white p-2 border border-gray-100 rounded-md mb-2 shadow-sm">
                          <div className="text-xs font-medium">活动经理</div>
                          <div className="text-xs text-blue-500">腾讯</div>
                        </div>
                        <div className="flex justify-center mb-2">
                          <button className="w-full py-1 border border-dashed border-gray-300 rounded-md text-gray-400 flex items-center justify-center">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4 flex items-center">
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">1</div>
                      <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs">2</div>
                      <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white flex items-center justify-center text-xs text-white">3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-center text-gray-600 mb-8">
            已有 <span className="font-semibold">250,000+</span> 求职者使用JobTrip管理求职并成功就职于 <span className="font-semibold">1000+</span> 家公司
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg" alt="Spotify" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" alt="Microsoft" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" alt="IBM" className="h-6" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Uber_logo_2018.svg" alt="Uber" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" alt="Salesforce" className="h-6" />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">职位追踪器</h2>
            <p className="text-center text-gray-600">管理您的求职过程，跟踪每个求职详情 - 备注、状态、任务、职位描述、薪资、地点、公司数据等。</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#F0F0FF] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Search className="text-[#6366F1]" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">追踪申请进度</h3>
              <p className="text-gray-600">轻松记录和跟踪每个职位申请的状态，从初次申请到最终录用，全程可视化管理。</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#F0F0FF] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-[#6366F1]" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">数据分析洞察</h3>
              <p className="text-gray-600">通过直观的图表和统计数据，分析你的求职效率和成功率，优化未来的申请策略。</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-[#F0F0FF] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="text-[#6366F1]" size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">提高求职效率</h3>
              <p className="text-gray-600">自动化记录，智能提醒，让你的求职过程更加高效、有序，不错过任何重要机会。</p>
            </div>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#F0F0FF] rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-[#6366F1] text-white p-1 rounded-md">
                  <BriefcaseIcon size={18} />
                </div>
                <span className="font-semibold">职位追踪</span>
                <div className="flex-1"></div>
                <div className="flex space-x-2">
                  <button className="bg-white text-xs py-1 px-2.5 rounded flex items-center gap-1 border border-gray-200">
                    <span>创建</span>
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">待申请</span>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full">5</span>
                  </div>
                  <div className="bg-white p-3 border border-gray-100 rounded-md mb-3 shadow-sm">
                    <div className="text-sm font-medium mb-1">工程师</div>
                    <div className="text-xs text-[#6366F1]">谷歌</div>
                  </div>
                  <div className="bg-white p-3 border border-gray-100 rounded-md mb-3 shadow-sm">
                    <div className="text-sm font-medium mb-1">高级工程师</div>
                    <div className="text-xs text-[#6366F1]">腾讯</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">已申请</span>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full">4</span>
                  </div>
                  <div className="bg-white p-3 border border-gray-100 rounded-md mb-3 shadow-sm">
                    <div className="text-sm font-medium mb-1">高级iOS工程师</div>
                    <div className="text-xs text-orange-500">苹果</div>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">面试</span>
                    <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded-full">2</span>
                  </div>
                  <div className="bg-white p-3 border border-gray-100 rounded-md mb-3 shadow-sm">
                    <div className="text-sm font-medium mb-1">活动管理</div>
                    <div className="text-xs text-blue-500">腾讯</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center">
                <RouterLink to="/jobs" className="text-[#6366F1] text-sm font-medium hover:text-[#4F46E5] flex items-center">
                  查看职位追踪器
                  <ArrowRight size={16} className="ml-1" />
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#6366F1] py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">准备好开始您的求职之旅了吗？</h2>
          <p className="text-xl text-indigo-200 mb-8">立即开始组织您的求职过程 - 完全免费！</p>
          <RouterLink to="/register" className="bg-white text-[#6366F1] px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors inline-flex items-center justify-center font-medium">
            免费注册
            <ChevronRight className="ml-2" size={20} />
          </RouterLink>
        </div>
      </div>
      
      {/* Resume Builder Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI 简历生成器</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">打造专业简历，提升求职竞争力。利用我们简单的简历生成器，获取专业模板和专家建议。</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80" 
                    alt="简历模板示例"
                    className="w-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">打造面试制胜简历</h3>
                <p className="text-gray-600 mb-6">
                  使用JobTrip的简历生成器创建专业简历，配备精美模板、AI建议和专业功能，帮助您获得更多面试机会。
                </p>
                <RouterLink to="/register" className="bg-[#6366F1] text-white px-6 py-3 rounded-lg hover:bg-[#4F46E5] transition-colors inline-flex items-center justify-center">
                  开始制作您的简历
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 