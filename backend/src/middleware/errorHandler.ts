import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * 自定义错误类
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 统一API响应格式
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
  traceId?: string;
}

/**
 * 创建统一的API响应
 */
export const createApiResponse = <T>(
  code: number, 
  message: string, 
  data: T | null = null,
  traceId?: string
): ApiResponse<T> => {
  return {
    code,
    message,
    data,
    timestamp: Date.now(),
    ...(traceId && { traceId })
  };
};

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // 默认错误状态码和消息
  let statusCode = 500;
  let message = '服务器内部错误';
  let isOperational = false;
  let code = 500;

  // 如果是自定义的AppError，使用其状态码和消息
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
    code = statusCode;
  } else if (err.name === 'ValidationError') {
    // Mongoose验证错误
    statusCode = 400;
    code = 400;
    message = err.message;
    isOperational = true;
  } else if (err.name === 'CastError') {
    // Mongoose类型转换错误
    statusCode = 400;
    code = 400;
    message = '无效的数据ID';
    isOperational = true;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT错误
    statusCode = 401;
    code = 401;
    message = '无效的令牌，请重新登录';
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    // JWT过期
    statusCode = 401;
    code = 401;
    message = '令牌已过期，请重新登录';
    isOperational = true;
  }

  // 生成请求的追踪ID
  const traceId = req.headers['x-request-id'] || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // 记录错误日志
  if (isOperational) {
    logger.warn(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip} - traceId: ${traceId}`);
  } else {
    logger.error(
      `${statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip} - traceId: ${traceId}`,
      { stack: err.stack }
    );
  }

  // 发送错误响应
  res.status(statusCode).json(createApiResponse(
    code,
    message,
    process.env.NODE_ENV === 'development' ? { stack: err.stack } : null,
    traceId as string
  ));
}; 