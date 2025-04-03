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
    <div className="container-lg">
      <div className="section">
        <h1 className="title-lg">简历生成器</h1>
        <p className="text-description">
          使用JobTrip的智能简历生成器创建专业、吸引人的简历，针对特定职位进行自动优化
        </p>
      </div>

      {/* 简历分类部分 */}
      <div className="section">
        <div className="grid-cols-1-2">
          {/* 基础简历部分 */}
          <div className="card">
            <div 
              className="card-header cursor-pointer"
              onClick={() => toggleAccordion('基础简历')}
            >
              <div>
                <h2 className="title-sm">基础简历</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">创建一份多功能简历作为基础模板</p>
              </div>
              <div>
                {activeAccordion === '基础简历' ? (
                  <ChevronUp className="accordion-icon" />
                ) : (
                  <ChevronDown className="accordion-icon" />
                )}
              </div>
            </div>
            
            {activeAccordion === '基础简历' && (
              <div className="card-body">
                <div className="space-y-4">
                  {resumeList.filter(resume => !resume.tailored).map(resume => (
                    <div 
                      key={resume.id}
                      className="resume-card"
                    >
                      <div 
                        className="resume-card-header"
                        onClick={() => toggleResumeExpand(resume.id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={resume.thumbnail} 
                            alt={resume.name}
                            className="resume-thumbnail"
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
                            <ChevronUp className="accordion-icon" />
                          ) : (
                            <ChevronDown className="accordion-icon" />
                          )}
                        </div>
                      </div>
                      
                      {expandedResume === resume.id && (
                        <div className="card-footer">
                          <div className="flex flex-wrap gap-2">
                            <button className="btn btn-outline btn-sm">
                              <Edit className="w-4 h-4 mr-1.5" />
                              编辑
                            </button>
                            <button className="btn btn-outline btn-sm">
                              <Download className="w-4 h-4 mr-1.5" />
                              下载
                            </button>
                            <button className="btn btn-outline btn-sm">
                              <Copy className="w-4 h-4 mr-1.5" />
                              复制
                            </button>
                            <button className="btn btn-danger btn-sm">
                              <Trash className="w-4 h-4 mr-1.5" />
                              删除
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button className="resume-add-button">
                    <Plus className="w-5 h-5 mr-2" />
                    创建新的基础简历
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* 定制简历部分 */}
          <div className="card">
            <div 
              className="card-header cursor-pointer"
              onClick={() => toggleAccordion('定制简历')}
            >
              <div>
                <h2 className="title-sm">定制简历</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">针对特定职位优化的简历版本</p>
              </div>
              <div>
                {activeAccordion === '定制简历' ? (
                  <ChevronUp className="accordion-icon" />
                ) : (
                  <ChevronDown className="accordion-icon" />
                )}
              </div>
            </div>
            
            {activeAccordion === '定制简历' && (
              <div className="card-body">
                <div className="space-y-4">
                  {resumeList.filter(resume => resume.tailored).map(resume => (
                    <div 
                      key={resume.id}
                      className="resume-card"
                    >
                      <div 
                        className="resume-card-header"
                        onClick={() => toggleResumeExpand(resume.id)}
                      >
                        <div className="flex items-center">
                          <img 
                            src={resume.thumbnail} 
                            alt={resume.name}
                            className="resume-thumbnail"
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
                            <ChevronUp className="accordion-icon" />
                          ) : (
                            <ChevronDown className="accordion-icon" />
                          )}
                        </div>
                      </div>
                      
                      {expandedResume === resume.id && (
                        <div className="card-footer">
                          <div className="flex flex-wrap gap-2">
                            <button className="btn btn-outline btn-sm">
                              <Edit className="w-4 h-4 mr-1.5" />
                              编辑
                            </button>
                            <button className="btn btn-outline btn-sm">
                              <Download className="w-4 h-4 mr-1.5" />
                              下载
                            </button>
                            <button className="btn btn-outline btn-sm">
                              <FileText className="w-4 h-4 mr-1.5" />
                              预览
                            </button>
                            <button className="btn btn-secondary btn-sm">
                              <ExternalLink className="w-4 h-4 mr-1.5" />
                              申请职位
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <button className="resume-add-button">
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
      <div className="section card p-6">
        <h2 className="title-md">简历建议</h2>
        <div className="grid-cols-1-2">
          <div className="resume-tip-card">
            <h3 className="font-medium text-gray-900 mb-2 dark:text-white">简历长度</h3>
            <p className="text-sm text-description mb-4">
              您的简历应该保持在1-2页之间。当前简历有3页，考虑精简内容以提高可读性。
            </p>
            <button className="text-sm text-indigo-600 font-medium dark:text-indigo-400">查看如何优化 →</button>
          </div>
          <div className="resume-tip-card">
            <h3 className="font-medium text-gray-900 mb-2 dark:text-white">行动导向的成就</h3>
            <p className="text-sm text-description mb-4">
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