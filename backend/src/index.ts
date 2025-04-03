import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';
import logger from './utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// 加载环境变量
dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
// 设置服务器监听的主机，使用0.0.0.0使其可以从局域网访问
const HOST = process.env.HOST || '0.0.0.0';

// 连接数据库
connectDB();

// 判断是否启用HTTPS
const enableHttps = process.env.ENABLE_HTTPS === 'true';
let server;

if (enableHttps) {
  try {
    // 读取SSL证书
    const certsDir = path.join(__dirname, '../certs');
    const privateKey = fs.readFileSync(path.join(certsDir, 'key.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(certsDir, 'cert.pem'), 'utf8');
    
    const credentials = { key: privateKey, cert: certificate };
    
    // 创建HTTPS服务器
    server = https.createServer(credentials, app);
    server.listen(PORT, HOST, () => {
      logger.info(`服务器运行在 https://${HOST}:${PORT} 环境: ${process.env.NODE_ENV}`);
      logger.info(`本地访问: https://localhost:${PORT}`);
      logger.info(`局域网访问: https://192.168.1.132:${PORT}`);
      logger.info(`注意: 使用自签名证书，浏览器可能会显示安全警告`);
    });
  } catch (err) {
    logger.error('无法启动HTTPS服务器，证书文件可能不存在');
    logger.error((err as Error).message);
    
    // 回退到HTTP模式
    server = app.listen(PORT, HOST, () => {
      logger.info(`无法加载SSL证书，回退到HTTP模式`);
      logger.info(`服务器运行在 http://${HOST}:${PORT} 环境: ${process.env.NODE_ENV}`);
      logger.info(`本地访问: http://localhost:${PORT}`);
      logger.info(`局域网访问: http://192.168.1.132:${PORT}`);
    });
  }
} else {
  // 启动HTTP服务器
  server = app.listen(PORT, HOST, () => {
    logger.info(`服务器运行在 http://${HOST}:${PORT} 环境: ${process.env.NODE_ENV}`);
    logger.info(`本地访问: http://localhost:${PORT}`);
    logger.info(`局域网访问: http://192.168.1.132:${PORT}`);
  });
}

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