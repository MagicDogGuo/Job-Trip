#!/usr/bin/env node

/**
 * 资源检查脚本
 * 检查必要的前端资源文件是否存在，如果不存在则自动下载
 */

const path = require('path');
const fs = require('fs');
const https = require('https');
const { exec } = require('child_process');

// 需要检查的资源文件
const resources = [
  {
    name: 'ReDoc Standalone',
    path: '../public/assets/js/redoc.standalone.js',
    url: 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js',
    fallbackUrl: 'https://cdn.jsdelivr.net/npm/redoc/bundles/redoc.standalone.js',
    fallbackCommand: 'npm install redoc@latest --no-save && cp node_modules/redoc/bundles/redoc.standalone.js public/assets/js/'
  },
  {
    name: 'Favicon',
    path: '../public/favicon.ico',
    url: 'https://unpkg.com/favicon.ico',
    fallbackCommand: 'touch public/favicon.ico'
  }
];

// 确保目录存在
const ensureDir = (dirPath) => {
  const absolutePath = path.resolve(__dirname, dirPath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`创建目录: ${absolutePath}`);
    fs.mkdirSync(absolutePath, { recursive: true });
  }
};

// 下载文件
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`请求失败，状态码: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

// 执行回退命令
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    console.log(`执行命令: ${command}`);
    exec(command, { cwd: path.resolve(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        console.error(`执行命令失败: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.warn(`命令警告: ${stderr}`);
      }
      console.log(`命令输出: ${stdout}`);
      resolve();
    });
  });
};

// 主函数
async function main() {
  console.log('开始检查资源文件...');
  
  for (const resource of resources) {
    const filePath = path.resolve(__dirname, resource.path);
    const dirPath = path.dirname(filePath);
    
    // 确保目录存在
    ensureDir(dirPath);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log(`缺少资源: ${resource.name}`);
      console.log(`尝试从 ${resource.url} 下载...`);
      
      try {
        await downloadFile(resource.url, filePath);
        console.log(`成功下载 ${resource.name} 到 ${filePath}`);
      } catch (err) {
        console.error(`下载失败: ${err.message}`);
        
        // 如果有备用URL，尝试备用URL
        if (resource.fallbackUrl) {
          console.log(`尝试从备用URL ${resource.fallbackUrl} 下载...`);
          try {
            await downloadFile(resource.fallbackUrl, filePath);
            console.log(`成功从备用URL下载 ${resource.name} 到 ${filePath}`);
          } catch (fallbackErr) {
            console.error(`备用URL下载失败: ${fallbackErr.message}`);
            console.log(`尝试使用回退命令...`);
            
            try {
              await executeCommand(resource.fallbackCommand);
              console.log(`使用回退命令成功获取 ${resource.name}`);
            } catch (cmdErr) {
              console.error(`回退命令失败: ${cmdErr.message}`);
              console.error(`无法获取 ${resource.name}，请手动创建文件: ${filePath}`);
            }
          }
        } else {
          console.log(`尝试使用回退命令...`);
          
          try {
            await executeCommand(resource.fallbackCommand);
            console.log(`使用回退命令成功获取 ${resource.name}`);
          } catch (cmdErr) {
            console.error(`回退命令失败: ${cmdErr.message}`);
            console.error(`无法获取 ${resource.name}，请手动创建文件: ${filePath}`);
          }
        }
      }
    } else {
      console.log(`✓ ${resource.name} 已存在`);
    }
  }
  
  console.log('资源检查完成！');
}

main().catch(err => {
  console.error('出错了:', err);
  process.exit(1);
}); 