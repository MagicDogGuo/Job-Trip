#!/usr/bin/env node

/**
 * 开发服务器启动脚本
 * 提供HTTP服务，监控请求日志，可用于调试HTTP/HTTPS问题
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// 定义日志目录
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 创建日志文件流
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// 打印标题
console.log('\x1b[36m%s\x1b[0m', '===================================');
console.log('\x1b[36m%s\x1b[0m', '   JobTrip 开发服务器 (HTTP模式)   ');
console.log('\x1b[36m%s\x1b[0m', '===================================');
console.log('\x1b[33m%s\x1b[0m', '注意: 此脚本仅用于开发环境');
console.log('\x1b[0m%s\x1b[0m', '');

// 设置环境变量
process.env.NODE_ENV = 'development';

// 启动开发服务器
const server = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

// 监听服务器的输出
server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output.trim());
  accessLogStream.write(`[${new Date().toISOString()}] ${output}`);
});

server.stderr.on('data', (data) => {
  const output = data.toString();
  console.error('\x1b[31m%s\x1b[0m', output.trim());
  errorLogStream.write(`[${new Date().toISOString()}] ${output}`);
});

// 监听服务器的退出
server.on('close', (code) => {
  console.log('\x1b[31m%s\x1b[0m', `开发服务器已关闭，退出码: ${code}`);
  accessLogStream.end();
  errorLogStream.end();
});

// 处理进程信号
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '接收到SIGINT信号，正在关闭服务器...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '接收到SIGTERM信号，正在关闭服务器...');
  server.kill('SIGTERM');
  process.exit(0);
}); 