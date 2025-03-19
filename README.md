# JobTrip 职途助手

JobTrip是一个智能求职追踪系统，旨在帮助求职者更有效地管理求职过程。该系统包括浏览器扩展和Web应用程序，可以自动收集主流招聘平台的职位信息，提供集中管理应用的平台，并帮助用户有效地组织和跟踪求职流程。

## 项目概述

JobTrip为新西兰就业市场的求职者提供了一站式解决方案，具有以下主要功能：

- 自动从LinkedIn、Indeed和Seek等热门招聘网站收集职位信息
- 提供一个集中平台管理所有职位申请
- 帮助用户有效组织和跟踪求职过程
- 提供数据分析和求职建议

## 技术栈

### 前端
- React 19
- TypeScript
- Vite
- Material-UI (MUI)
- Redux Toolkit
- React Router DOM
- Axios

### 后端
- Node.js
- Express.js
- TypeScript
- MongoDB
- JWT (用户认证)
- Swagger (API文档)
- Winston (日志管理)

### 浏览器扩展
- Chrome Extension API
- Web Scraping技术

## 系统架构

项目采用前后端分离的架构：

1. **前端**：React单页应用，负责用户界面和交互
2. **后端**：Node.js API服务，处理业务逻辑和数据存储
3. **浏览器扩展**：实现从招聘网站自动收集职位信息

## 安装与运行

### 后端

#### 前提条件
- Node.js (>=14.0.0)
- MongoDB

#### 安装依赖
```bash
cd backend
npm install
```

#### 环境变量配置
1. 复制`.env.example`文件为`.env`
2. 根据需要修改以下配置:
   - `PORT` - API服务端口
   - `HOST` - 服务器监听地址
   - `MONGODB_URI` - MongoDB连接字符串
   - `JWT_SECRET` - JWT密钥

#### 运行开发环境
```bash
npm run dev
```

#### 构建生产环境
```bash
npm run build
npm start
```

### 前端

#### 前提条件
- Node.js (>=14.0.0)

#### 安装依赖
```bash
cd frontend
npm install
```

#### 运行开发环境
```bash
# 本地开发
npm run dev

# 局域网访问
npm run dev:host
```

#### 构建生产环境
```bash
npm run build
```

## API文档

API文档使用以下方式提供：

1. **Swagger UI文档**
   - 本地访问: http://localhost:5000/api-docs
   - 局域网访问: http://192.168.1.132:5000/api-docs

2. **ReDoc美化文档** (推荐)
   - 本地访问: http://localhost:5000/docs
   - 局域网访问: http://192.168.1.132:5000/docs

### 生成静态API文档
```bash
cd backend
npm run generate-docs
```

## 主要功能

### 用户管理
- 用户注册和登录
- 个人资料管理
- 密码更新

### 职位管理
- 获取职位列表
- 创建、查看、更新和删除职位
- 职位搜索和筛选

### 公司管理
- 获取公司列表
- 创建、查看、更新和删除公司信息

### 用户-职位关联
- 跟踪职位申请状态（新职位、已申请、面试中等）
- 管理职位申请进度
- 职位申请数据统计

## 项目结构

```
/
├── frontend/                # 前端React应用
│   ├── src/                 # 源代码
│   │   ├── assets/          # 静态资源
│   │   ├── components/      # 组件
│   │   ├── context/         # React上下文
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── pages/           # 页面组件
│   │   ├── redux/           # Redux状态管理
│   │   ├── routes/          # 路由配置
│   │   ├── services/        # API服务
│   │   ├── styles/          # 样式文件
│   │   ├── types/           # TypeScript类型定义
│   │   ├── utils/           # 工具函数
│   │   ├── App.tsx          # 应用入口组件
│   │   └── main.tsx         # 应用启动入口
│   └── package.json         # 项目依赖
│
├── backend/                 # 后端API服务
│   ├── src/                 # 源代码
│   │   ├── config/          # 配置文件
│   │   ├── controllers/     # 控制器
│   │   ├── middleware/      # 中间件
│   │   ├── models/          # 数据模型
│   │   ├── routes/          # 路由
│   │   ├── services/        # 业务服务
│   │   ├── utils/           # 工具函数
│   │   ├── app.ts           # Express应用
│   │   └── index.ts         # 应用入口
│   ├── logs/                # 日志文件
│   └── package.json         # 项目依赖
│
└── docs/                    # 项目文档
    ├── backend-requirements.md    # 后端需求文档
    ├── database-requirements.md   # 数据库需求文档
    ├── deployment-guide.md        # 部署指南
    ├── frontend-requirements.md   # 前端需求文档
    └── Project Proposal.md        # 项目提案
```

## 开发计划

项目采用Scrum敏捷开发方法，共计划4个冲刺：

1. **冲刺1：项目搭建**
   - 搭建项目框架
   - 定义基础API
   - 设计数据库
   - 构建前后端框架

2. **冲刺2：核心功能**
   - 开发浏览器扩展
   - 创建前端UI
   - 连接数据到系统

3. **冲刺3：功能完善**
   - 添加用户登录
   - 构建数据统计
   - 修复bug

4. **冲刺4：最终阶段**
   - 优化性能
   - 用户测试
   - 完成文档

## 贡献指南

1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

MIT
