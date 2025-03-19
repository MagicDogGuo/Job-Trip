# JobTrip 职途助手部署指南

本文档提供了在 Debian 12 服务器上部署 JobTrip 职途助手的完整步骤，包括前端、后端和数据库的配置。

## 目录

1. [环境准备](#1-环境准备)
2. [MongoDB 数据库部署](#2-mongodb-数据库部署)
3. [Redis 缓存部署（可选）](#3-redis-缓存部署可选)
4. [后端服务部署](#4-后端服务部署)
5. [前端应用部署](#5-前端应用部署)
6. [Nginx 配置](#6-nginx-配置)
7. [安全配置](#7-安全配置)
8. [监控和维护](#8-监控和维护)
9. [常见问题排查](#9-常见问题排查)

## 1. 环境准备

### 1.1 更新系统

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 安装基本工具

```bash
sudo apt install -y curl gnupg wget git vim build-essential net-tools
```

### 1.3 配置防火墙

```bash
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 1.4 安装 Node.js

```bash
# Download and install fnm:
curl -o- https://fnm.vercel.app/install | bash

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".

# Verify npm version:
npm -v # Should print "10.9.2".

# 安装 PM2 进程管理器
sudo npm install -g pm2
```

## 2. MongoDB 数据库部署

### 2.1 安装 MongoDB

```bash
# 导入 MongoDB GPG 密钥
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

# 添加 MongoDB 源
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# 更新包索引并安装 MongoDB
sudo apt update
sudo apt install -y mongodb-org
```

### 2.2 启动 MongoDB

默认情况下，MongoDB 实例存储：
数据文件在 /var/lib/mongodb 中
日志文件位于 /var/log/mongodb

```bash
# 启动 MongoDB 服务
sudo systemctl enable mongod
sudo systemctl start mongod
```

### 2.3 MongoDB 安全配置

```bash
# 创建管理员用户
mongosh admin --eval '
  db.createUser({
    user: "admin",
    pwd: "强密码请修改",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  })
'

# 创建应用数据库用户
mongosh admin -u admin -p '强密码请修改' --eval '
  db.getSiblingDB("jobtrip").createUser({
    user: "jobtripapp",
    pwd: "应用密码请修改",
    roles: [ { role: "readWrite", db: "jobtrip" } ]
  })
'
```

### 2.4 配置 MongoDB 认证

```bash
# 编辑 MongoDB 配置文件
sudo vim /etc/mongod.conf
```

修改配置文件:

```yaml
# 网络设置
net:
  port: 27017
  bindIp: 127.0.0.1

# 安全设置
security:
  authorization: enabled
```

重启 MongoDB 服务:

```bash
sudo systemctl restart mongod
```

### 2.5 MongoDB 备份配置

创建备份脚本:

```bash
sudo mkdir -p /opt/scripts
sudo vim /opt/scripts/mongodb-backup.sh
```

添加以下内容:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/opt/backups/mongodb"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 执行备份
mongodump --uri="mongodb://jobtripapp:应用密码请修改@127.0.0.1:27017/jobtrip" --out="$BACKUP_DIR/$DATE"

# 保留最近7天的备份
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

设置权限:

```bash
sudo chmod +x /opt/scripts/mongodb-backup.sh
```

添加到定时任务:

```bash
echo "0 2 * * * /opt/scripts/mongodb-backup.sh" | sudo tee -a /etc/crontab
```

## 3. Redis 缓存部署（可选）

### 3.1 安装 Redis

```bash
sudo apt install -y redis-server
```

### 3.2 配置 Redis

编辑配置文件:

```bash
sudo vim /etc/redis/redis.conf
```

修改以下设置:

```
# 监听地址改为本地
bind 127.0.0.1
# 设置密码
requirepass 强密码请修改
# 启用持久化
appendonly yes
```

重启 Redis:

```bash
sudo systemctl restart redis-server
```

## 4. 后端服务部署

### 4.1 克隆项目代码

```bash
cd /var/www
sudo mkdir -p jobtrip
sudo chown $USER:$USER -R jobtrip
git clone https://github.com/your-organization/jobtrip-backend.git jobtrip/backend
cd jobtrip/backend
```

### 4.2 安装依赖

```bash
npm install
```

### 4.3 配置环境变量

创建 .env 文件:

```bash
vim .env
```

添加以下配置:

```
# 服务器配置
PORT=8080
NODE_ENV=production

# 数据库配置
MONGODB_URI=mongodb://jobtripapp:应用密码请修改@127.0.0.1:27017/jobtrip?authSource=admin

# JWT配置
JWT_SECRET=生成随机字符串替换此处
JWT_EXPIRES_IN=7d

# Redis配置 (如果使用)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=强密码请修改

# 日志配置
LOG_LEVEL=info
```

### 4.4 构建应用

```bash
npm run build
```

### 4.5 使用 PM2 启动服务

创建 PM2 配置文件:

```bash
vim ecosystem.config.js
```

添加以下内容:

```javascript
module.exports = {
  apps: [{
    name: 'jobtrip-backend',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

启动服务:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup debian
```

## 5. 前端应用部署

### 5.1 克隆前端代码

```bash
cd /var/www/jobtrip
git clone https://github.com/your-organization/jobtrip-frontend.git frontend
cd frontend
```

### 5.2 安装依赖和构建

```bash
npm install
```

### 5.3 环境变量配置

创建 .env.production 文件:

```bash
vim .env.production
```

添加以下内容:

```
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_ENV=production
```

### 5.4 构建应用

```bash
npm run build
```

## 6. Nginx 配置

### 6.1 安装 Nginx

```bash
sudo apt install -y nginx
```

### 6.2 配置 Nginx

创建配置文件:

```bash
sudo vim /etc/nginx/sites-available/jobtrip
```

添加以下内容:

```nginx
# 后端API服务
upstream backend_servers {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name yourdomain.com;

    # 重定向到HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    # SSL证书配置
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    # 安全相关头信息
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # 前端应用
    location / {
        root /var/www/jobtrip/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API请求代理
    location /api/ {
        proxy_pass http://backend_servers/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /var/www/jobtrip/frontend/build;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }
}
```

启用配置:

```bash
sudo ln -s /etc/nginx/sites-available/jobtrip /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 配置 SSL 证书

使用 Certbot 获取 SSL 证书:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 7. 安全配置

### 7.1 配置自动更新

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 7.2 配置日志轮转

```bash
sudo vim /etc/logrotate.d/jobtrip
```

添加以下内容:

```
/var/www/jobtrip/backend/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
```

### 7.3 设置文件权限

```bash
sudo chown -R www-data:www-data /var/www/jobtrip
sudo find /var/www/jobtrip -type d -exec chmod 755 {} \;
sudo find /var/www/jobtrip -type f -exec chmod 644 {} \;
```

## 8. 监控和维护

### 8.1 安装监控工具

```bash
# 安装 Prometheus Node Exporter
sudo apt install -y prometheus-node-exporter

# 安装 MongoDB Exporter
sudo apt install -y prometheus-mongodb-exporter
```

### 8.2 日志监控

```bash
# 查看后端日志
pm2 logs jobtrip-backend

# 查看 MongoDB 日志
sudo tail -f /var/log/mongodb/mongod.log

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 8.3 创建系统健康检查脚本

```bash
sudo vim /opt/scripts/system-health.sh
```

添加以下内容:

```bash
#!/bin/bash

# 检查服务状态
SERVICE_STATUS=$(systemctl is-active mongod redis-server nginx)
if [[ $SERVICE_STATUS == *"inactive"* ]]; then
    echo "警告: 有服务未运行: $SERVICE_STATUS"
fi

# 检查磁盘空间
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "警告: 磁盘使用率超过 80%: $DISK_USAGE%"
fi

# 检查 MongoDB 连接
mongo_status=$(mongosh admin --quiet --eval "db.serverStatus().connections.current" || echo "无法连接")
if [[ "$mongo_status" == "无法连接" ]]; then
    echo "警告: MongoDB 连接失败"
fi

# 检查后端服务
if ! pm2 list | grep -q "jobtrip-backend"; then
    echo "警告: 后端服务未运行"
fi
```

设置执行权限并添加到定时任务:

```bash
sudo chmod +x /opt/scripts/system-health.sh
echo "0 * * * * /opt/scripts/system-health.sh | mail -s '系统健康检查' admin@youremail.com" | sudo tee -a /etc/crontab
```

## 9. 常见问题排查

### 9.1 MongoDB 连接问题

如果后端无法连接 MongoDB:

1. 检查 MongoDB 服务状态:
   ```bash
   sudo systemctl status mongod
   ```

2. 确认端口监听:
   ```bash
   sudo ss -tulpn | grep 27017
   ```

3. 测试数据库连接:
   ```bash
   mongosh mongodb://jobtripapp:密码@127.0.0.1:27017/jobtrip?authSource=admin
   ```

### 9.2 后端服务无法启动

1. 检查日志:
   ```bash
   pm2 logs jobtrip-backend
   ```

2. 验证环境变量:
   ```bash
   pm2 env jobtrip-backend
   ```

3. 检查依赖安装:
   ```bash
   cd /var/www/jobtrip/backend
   npm ls
   ```

### 9.3 前端应用问题

1. 验证 Nginx 配置:
   ```bash
   sudo nginx -t
   ```

2. 检查文件权限:
   ```bash
   ls -la /var/www/jobtrip/frontend/build
   ```

3. 查看 Nginx 错误日志:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

## 开发环境配置

### 开发环境局域网访问

如果需要在局域网内的其他设备上访问开发服务器，请按以下步骤操作：

1. 在后端配置文件`.env`中设置：
   ```
   HOST=0.0.0.0
   ```

2. 确保服务器的防火墙允许相应端口的入站连接：
   - 后端API服务默认端口：5000
   - 前端开发服务默认端口：3000

3. 获取服务器的IP地址（例如：192.168.1.132）

4. 在局域网内的其他设备上，通过浏览器访问：
   ```
   http://192.168.1.132:5000  # 后端API服务
   http://192.168.1.132:3000  # 前端开发服务
   ```

5. API文档可以通过以下地址访问：
   ```
   http://192.168.1.132:5000/api-docs  # Swagger UI
   http://192.168.1.132:5000/docs      # ReDoc（推荐）
   ```

注意：
- 如果使用了不同端口，请相应调整访问URL
- 如果服务器正在运行，需要重启服务才能应用新的HOST配置

---

本部署指南提供了在 Debian 12 服务器上部署 JobTrip 职途助手的基本步骤。根据实际项目需求，可能需要进行额外的配置和调整。请确保在生产环境中使用强密码并遵循安全最佳实践。 