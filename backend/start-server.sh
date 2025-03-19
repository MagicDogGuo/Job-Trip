#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # 重置颜色

# 打印带颜色的消息
echo -e "${BLUE}=======================================${NC}"
echo -e "${GREEN}JobTrip 职途助手后端${NC}"
echo -e "${BLUE}=======================================${NC}"

# 检查环境文件
if [ ! -f .env ]; then
    echo -e "${YELLOW}警告: .env 文件不存在, 正在从样例创建...${NC}"
    cp .env.example .env
    echo -e "${GREEN}已创建 .env 文件, 请根据需要修改配置${NC}"
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}未检测到依赖, 正在安装...${NC}"
    npm install
    echo -e "${GREEN}依赖安装完成${NC}"
fi

# 检查目录
mkdir -p logs

# 构建项目
echo -e "${BLUE}正在构建项目...${NC}"
npm run build

# 检查构建是否成功
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}构建失败, 尝试直接启动开发环境${NC}"
    echo -e "${BLUE}启动开发服务器...${NC}"
    npm run dev
else
    # 启动服务器
    echo -e "${BLUE}启动生产服务器...${NC}"
    npm start
fi 