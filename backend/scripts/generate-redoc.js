#!/usr/bin/env node

/**
 * 生成静态ReDoc文档脚本
 * 
 * 用法: 
 * npm run generate-docs
 * 
 * 此脚本会从API自动生成静态API文档网站
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// 目录配置
const OUTPUT_DIR = path.join(__dirname, '../public/docs');
const SWAGGER_JSON_PATH = path.join(OUTPUT_DIR, 'swagger.json');

console.log('🚀 开始生成静态API文档...');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  console.log(`📁 创建输出目录: ${OUTPUT_DIR}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 启动一个临时服务器来获取Swagger JSON
console.log('🔄 启动临时服务器获取Swagger规范...');

try {
  // 获取Swagger JSON
  const apiPort = process.env.PORT || 5000;
  
  // 构建URL - 这里假设我们可以从本地服务获取
  // 注意：实际使用时需要先启动服务，或者直接从项目中导入swagger配置
  const swaggerJsonUrl = `http://localhost:${apiPort}/api-docs.json`;
  
  console.log(`⚠️ 请确保API服务已经在端口 ${apiPort} 运行`);
  console.log(`⚠️ 如果无法自动获取，请手动将 ${swaggerJsonUrl} 的内容保存到 ${SWAGGER_JSON_PATH}`);
  
  // 使用redoc-cli生成静态文档
  console.log('📝 生成静态ReDoc文档...');
  
  try {
    execSync(`npx redoc-cli bundle ${swaggerJsonUrl} -o ${path.join(OUTPUT_DIR, 'index.html')} --title "JobTrip API 文档" --disableGoogleFont`, {
      stdio: 'inherit'
    });
    
    console.log('✨ 静态文档生成成功!');
    console.log(`📄 文档位置: ${path.join(OUTPUT_DIR, 'index.html')}`);
  } catch (error) {
    console.error('❌ 生成静态文档失败，尝试手动方式...');
    console.log('请尝试手动运行以下命令:');
    console.log(`npx redoc-cli bundle ${swaggerJsonUrl} -o ${path.join(OUTPUT_DIR, 'index.html')} --title "JobTrip API 文档" --disableGoogleFont`);
  }
  
  // 创建一个自定义的CSS文件来改进样式
  const customCss = `
/* JobTrip API 文档自定义样式 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.redoc-wrap {
  background-color: #fafafa;
}

.api-info h1 {
  font-family: 'Montserrat', sans-serif;
  color: #333;
  font-weight: 600;
}

.menu-content {
  background-color: #f0f0f0;
  border-right: 1px solid #e0e0e0;
}

.menu-item-title {
  font-weight: 500;
}

.operation-tag {
  font-size: 1.1em;
  font-weight: 600;
  color: #0056b3;
}

.token.string {
  color: #4caf50;
}

.token.number {
  color: #f44336;
}

.token.boolean {
  color: #9c27b0;
}

.token.null {
  color: #ff9800;
}
  `;
  
  fs.writeFileSync(path.join(OUTPUT_DIR, 'custom.css'), customCss);
  console.log('✨ 自定义样式已创建');
  
} catch (error) {
  console.error('❌ 文档生成过程中出错:', error.message);
  process.exit(1);
} 