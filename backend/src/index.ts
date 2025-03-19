import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';
import logger from './utils/logger';

// 加载环境变量
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
// 设置服务器监听的主机，使用0.0.0.0使其可以从局域网访问
const HOST = process.env.HOST || '0.0.0.0';

// 连接数据库
connectDB();

// 启动服务器
const server = app.listen(PORT, HOST, () => {
  logger.info(`服务器运行在 http://${HOST}:${PORT} 环境: ${process.env.NODE_ENV}`);
  logger.info(`本地访问: http://localhost:${PORT}`);
  logger.info(`局域网访问: http://192.168.1.132:${PORT}`);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logger.error('未捕获的异常！正在关闭服务器...');
  logger.error(err.name, err.message, err.stack);
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (err: Error) => {
  logger.error('未处理的Promise拒绝！正在关闭服务器...');
  logger.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});

export default server; 