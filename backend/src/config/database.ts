import mongoose from 'mongoose';
import logger from '../utils/logger';

/**
 * 连接到MongoDB数据库
 * @returns {Promise<void>}
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.NODE_ENV === 'development'
      ? process.env.MONGODB_URI_TEST
      : process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('未配置MongoDB连接URL，请检查环境变量');
    }

    const conn = await mongoose.connect(mongoURI);

    logger.info(`MongoDB连接成功: ${mongoURI}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`MongoDB连接失败: ${error.message}`);
    } else {
      logger.error('MongoDB连接失败，发生未知错误');
    }
    process.exit(1);
  }
};

/**
 * 关闭MongoDB连接
 * @returns {Promise<void>}
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB连接已关闭');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`关闭MongoDB连接失败: ${error.message}`);
    } else {
      logger.error('关闭MongoDB连接失败，发生未知错误');
    }
  }
}; 