#!/usr/bin/env node

/**
 * HTTPS开发服务器启动脚本
 * 提供HTTPS服务，使用自签名证书，用于需要HTTPS的开发场景
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const https = require('https');
const express = require('express');

// 定义日志目录
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 创建日志文件流
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'https-access.log'),
  { flags: 'a' }
);

const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'https-error.log'),
  { flags: 'a' }
);

// 检查证书文件是否存在
const certsDir = path.join(__dirname, '../certs');
const keyPath = path.join(certsDir, 'key.pem');
const certPath = path.join(certsDir, 'cert.pem');

// 打印标题
console.log('\x1b[36m%s\x1b[0m', '===================================');
console.log('\x1b[36m%s\x1b[0m', '   JobTrip 开发服务器 (HTTPS模式)   ');
console.log('\x1b[36m%s\x1b[0m', '===================================');
console.log('\x1b[33m%s\x1b[0m', '注意: 此脚本仅用于开发环境');
console.log('\x1b[0m%s\x1b[0m', '');

// 检查证书
if (!fs.existsSync(certsDir) || !fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.log('\x1b[33m%s\x1b[0m', '未找到SSL证书！正在生成自签名证书...');
  
  // 创建证书目录
  if (!fs.existsSync(certsDir)) {
    fs.mkdirSync(certsDir, { recursive: true });
  }
  
  // 生成自签名证书
  const opensslCmd = spawn('openssl', [
    'req', '-x509', 
    '-newkey', 'rsa:4096', 
    '-keyout', keyPath, 
    '-out', certPath, 
    '-days', '365', 
    '-nodes',
    '-subj', '/CN=localhost'
  ], {
    stdio: 'pipe',
    shell: true
  });
  
  opensslCmd.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });
  
  opensslCmd.stderr.on('data', (data) => {
    console.error('\x1b[31m%s\x1b[0m', data.toString().trim());
  });
  
  opensslCmd.on('close', (code) => {
    if (code === 0) {
      console.log('\x1b[32m%s\x1b[0m', '自签名证书生成成功！');
      startDevServer();
    } else {
      console.error('\x1b[31m%s\x1b[0m', `证书生成失败，退出码: ${code}`);
      process.exit(1);
    }
  });
} else {
  console.log('\x1b[32m%s\x1b[0m', '发现SSL证书，正在启动HTTPS服务器...');
  startDevServer();
}

function startDevServer() {
  // 设置环境变量
  process.env.NODE_ENV = 'development';
  process.env.ENABLE_HTTPS = 'true';
  
  // 启动开发服务器
  const server = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe',
    shell: true,
    env: { ...process.env }
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
}

// 处理进程信号
process.on('SIGINT', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '接收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n\x1b[33m%s\x1b[0m', '接收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
}); 