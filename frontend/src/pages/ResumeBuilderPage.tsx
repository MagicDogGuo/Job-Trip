import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Download, Copy, Edit, Trash, Plus, FileText, ExternalLink } from 'lucide-react';

/**
 * 简历生成器页面组件
 * 用于创建和管理求职简历
 */
const ResumeBuilderPage: React.FC = () => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>('基础简历');
  const [expandedResume, setExpandedResume] = useState<number | null>(1);

  // 简历列表数据
  const resumeList = [
    {
      id: 1,
      name: '软件工程师基础简历',
      lastUpdated: '2023-05-15',
      tailored: false,
      targetPosition: '前端工程师',
      thumbnail: 'https://placehold.co/120x160?text=简历1',
    },
    {
      id: 2,
      name: 'Twitter前端工程师定制简历',
      lastUpdated: '2023-06-20',
      tailored: true,
      targetJob: 'Twitter前端工程师',
      targetPosition: '前端工程师',
      thumbnail: 'https://placehold.co/120x160?text=简历2',
    },
    {
      id: 3,
      name: 'Google全栈工程师定制简历',
      lastUpdated: '2023-07-05',
      tailored: true,
      targetJob: 'Google全栈工程师',
      targetPosition: '全栈工程师',
      thumbnail: 'https://placehold.co/120x160?text=简历3',
    }
  ];

  // 切换手风琴状态
  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  // 切换简历展开状态
  const toggleResumeExpand = (id: number) => {
    setExpandedResume(expandedResume === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-white">简历生成器</h1>
        <p className="text-gray-600 dark:text-gray-300">
          使用JobTrip的智能简历生成器创建专业、吸引人的简历，针对特定职位进行自动优化
        </p>
      </div>

      {/* 简历分类部分 */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 基础简历部分 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div 
              className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer dark:bg-gray-700 dark:border-gray-600"
              onClick={() => toggleAccordion('基础简历')}
            >
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">基础简历</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">创建一份多功能简历作为基础模板</p>
              </div>
              <div>
                {activeAccordion === '基础简历' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
            </div>
            
            {activeAccordion === '基础简历' && (
              <div className="p-4">
                <div className="space-y-4">
                  {resumeList.filter(resume => !resume.tailored).map(resume => (
                    <div 
                      key={resume.id}
                      className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700"
                    >
                      <div 
                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => toggleResumeExpand(resume.id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={resume.thumbnail} 
                            alt={resume.name}
                            className="w-10 h-14 object-cover rounded mr-3"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{resume.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              目标职位: {resume.targetPosition} • 更新于 {resume.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div>
                          {expandedResume === resume.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {expandedResume === resume.id && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                          <div className="flex flex-wrap gap-2">
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <Edit className="w-4 h-4 mr-1.5" />
                              编辑
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <Download className="w-4 h-4 mr-1.5" />
                              下载
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <Copy className="w-4 h-4 mr-1.5" />
                              复制
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-red-400 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <Trash className="w-4 h-4 mr-1.5" />
                              删除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button className="w-full py-3 px-4 bg-indigo-50 text-indigo-600 rounded-lg border border-dashed border-indigo-300 flex items-center justify-center dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-700">
                    <Plus className="w-5 h-5 mr-2" />
                    创建新的基础简历
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* 定制简历部分 */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden dark:bg-gray-800 dark:border-gray-700">
            <div 
              className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center cursor-pointer dark:bg-gray-700 dark:border-gray-600"
              onClick={() => toggleAccordion('定制简历')}
            >
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">定制简历</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">针对特定职位优化的简历版本</p>
              </div>
              <div>
                {activeAccordion === '定制简历' ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                )}
              </div>
            </div>
            
            {activeAccordion === '定制简历' && (
              <div className="p-4">
                <div className="space-y-4">
                  {resumeList.filter(resume => resume.tailored).map(resume => (
                    <div 
                      key={resume.id}
                      className="border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700"
                    >
                      <div 
                        className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => toggleResumeExpand(resume.id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={resume.thumbnail} 
                            alt={resume.name}
                            className="w-10 h-14 object-cover rounded mr-3"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{resume.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              目标: {resume.targetJob} • 更新于 {resume.lastUpdated}
                            </p>
                          </div>
                        </div>
                        <div>
                          {expandedResume === resume.id ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      {expandedResume === resume.id && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                          <div className="flex flex-wrap gap-2">
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <Edit className="w-4 h-4 mr-1.5" />
                              编辑
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <Download className="w-4 h-4 mr-1.5" />
                              下载
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:text-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600">
                              <FileText className="w-4 h-4 mr-1.5" />
                              预览
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 border border-indigo-300 rounded-md hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/30 dark:border-indigo-700 dark:hover:bg-indigo-900/50">
                              <ExternalLink className="w-4 h-4 mr-1.5" />
                              申请职位
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button className="w-full py-3 px-4 bg-indigo-50 text-indigo-600 rounded-lg border border-dashed border-indigo-300 flex items-center justify-center dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-700">
                    <Plus className="w-5 h-5 mr-2" />
                    从现有简历创建定制版本
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 简历建议部分 */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">简历建议</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 mb-2 dark:text-white">简历长度</h3>
            <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
              您的简历应该保持在1-2页之间。当前简历有3页，考虑精简内容以提高可读性。
            </p>
            <button className="text-sm text-indigo-600 font-medium dark:text-indigo-400">查看如何优化 →</button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 mb-2 dark:text-white">行动导向的成就</h3>
            <p className="text-sm text-gray-600 mb-4 dark:text-gray-300">
              使用行动词来开始您的成就描述，并量化结果以展示您的影响力。
            </p>
            <button className="text-sm text-indigo-600 font-medium dark:text-indigo-400">查看示例 →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderPage; 