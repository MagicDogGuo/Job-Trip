/**
 * 内容安全策略(CSP)辅助函数
 * 提供一致的CSP配置，确保Web Worker和其他特性正常工作
 */

/**
 * 获取开发环境下的基本CSP策略
 * 允许内联脚本、Web Worker和其他必要资源
 */
export const getBasicCSP = (): string => {
  return "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'";
};

/**
 * 获取开发环境下适用于API文档的增强CSP策略
 * 允许加载更多外部资源
 */
export const getDocsCSP = (): string => {
  return "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: cdn.jsdelivr.net cdn.redoc.ly; worker-src blob:; style-src 'self' 'unsafe-inline' fonts.googleapis.com cdn.jsdelivr.net; img-src 'self' data: cdn.jsdelivr.net; font-src 'self' data: fonts.gstatic.com fonts.googleapis.com; connect-src 'self'";
};

/**
 * 获取生产环境下更严格的CSP策略
 * 生产环境中应该移除不必要的宽松设置
 */
export const getProductionCSP = (): string => {
  // 生产环境中应该根据实际需求设置更严格的CSP
  if (process.env.NODE_ENV === 'production') {
    return "default-src 'self'; script-src 'self' blob:; worker-src blob:; style-src 'self'; img-src 'self'; font-src 'self'; connect-src 'self'";
  }
  // 默认返回开发环境CSP
  return getBasicCSP();
}; 