# JobTrip Career Assistant Deployment Guide

This document provides complete steps for deploying JobTrip on a Debian 12 server, including front-end, back-end, and database configuration.

## Table of contents

1. [Environmental Preparation](#1-Environmental Preparation)
2. [MongoDB database deployment](#2-mongodb-database deployment)
3. [Redis cache deployment (optional)](#3-redis-cache deployment optional)
4. [Backend service deployment](#4-Backend service deployment)
5. [Front-end application deployment](#5-Front-end application deployment)
6. [Nginx configuration](#6-nginx-configuration)
7. [Security Configuration](#7-Security Configuration)
8. [Monitoring and Maintenance](#8-Monitoring and Maintenance)
9. [FAQ](#9-FAQ)

## 1. Environment preparation

### 1.1 Update system

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install basic tools

```bash
sudo apt install -y curl gnupg wget git vim build-essential net-tools
```

### 1.3 Configure firewall

```bash
sudo apt install -y ufw
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 1.4 Install Node.js

```bash
# Download and install fnm:
curl -o- https://fnm.vercel.app/install | bash

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".

# Verify npm version:
npm -v # Should print "10.9.2".

# Install PM2 process manager
sudo npm install -g pm2
```

## 2. MongoDB database deployment

### 2.1 Install MongoDB

```bash
# Import MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor

# Add MongoDB source
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] http://repo.mongodb.org/apt/debian bookworm/mongodb-org/8.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list

# Update package index and install MongoDB
sudo apt update
sudo apt install -y mongodb-org
```

### 2.2 Start MongoDB

By default, MongoDB instances store:
Data files are in /var/lib/mongodb
The log file is located at /var/log/mongodb

```bash
# Start the MongoDB service
sudo systemctl enable mongod
sudo systemctl start mongod
```

### 2.3 MongoDB security configuration

```bash
#Create admin user
mongosh admin --eval '
  db.createUser({
    user: "admin",
pwd: "Please change the strong password",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  })
'

#Create application database user
mongosh admin -u admin -p 'Please change the strong password' --eval '
  db.getSiblingDB("jobtrip").createUser({
    user: "jobtripapp",
pwd: "Please change the application password",
    roles: [ { role: "readWrite", db: "jobtrip" } ]
  })
'
```

### 2.4 Configure MongoDB authentication

```bash
# Edit MongoDB configuration file
sudo vim /etc/mongod.conf
```

Modify configuration file:

```yaml
# Network settings
net:
  port: 27017
  bindIp: 127.0.0.1

# Security settings
security:
  authorization: enabled
```

Restart the MongoDB service:

```bash
sudo systemctl restart mongod
```

### 2.5 MongoDB backup configuration

Create backup script:

```bash
sudo mkdir -p /opt/scripts
sudo vim /opt/scripts/mongodb-backup.sh
```

Add the following:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d)
BACKUP_DIR="/opt/backups/mongodb"

#Create backup directory
mkdir -p $BACKUP_DIR

# Perform backup
mongodump --uri="mongodb://jobtripapp:Please change the application password @127.0.0.1:27017/jobtrip" --out="$BACKUP_DIR/$DATE"

# Keep backups of the last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;
```

Set permissions:

```bash
sudo chmod +x /opt/scripts/mongodb-backup.sh
```

Add to scheduled tasks:

```bash
echo "0 2 * * * /opt/scripts/mongodb-backup.sh" | sudo tee -a /etc/crontab
```

## 3. Redis cache deployment (optional)

### 3.1 Install Redis

```bash
sudo apt install -y redis-server
```

### 3.2 Configure Redis

Edit configuration file:

```bash
sudo vim /etc/redis/redis.conf
```

Modify the following settings:

```
# Change the listening address to local
bind 127.0.0.1
# Set password
Please change requirepass strong password
# Enable persistence
appendonly yes
```

Restart Redis:

```bash
sudo systemctl restart redis-server
```

## 4. Backend service deployment

### 4.1 Clone project code

```bash
cd /var/www
sudo mkdir -p jobtrip
sudo chown $USER:$USER -R jobtrip
git clone https://github.com/your-organization/jobtrip-backend.git jobtrip/backend
cd jobtrip/backend
```

### 4.2 Install dependencies

```bash
npm install
```

### 4.3 Configure environment variables

Create .env file:

```bash
vim .env
```

Add the following configuration:

```
# Server configuration
PORT=8080
NODE_ENV=production

# Database configuration
MONGODB_URI=mongodb://jobtripapp:Please change the application password @127.0.0.1:27017/jobtrip?authSource=admin

# JWT configuration
JWT_SECRET=Generate random string to replace here
JWT_EXPIRES_IN=7d

# Redis configuration (if used)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=Please change the strong password

# Log configuration
LOG_LEVEL=info
```

### 4.4 Building the application

```bash
npm run build
```

### 4.5 Use PM2 to start the service

Create PM2 configuration file:

```bash
vim ecosystem.config.js
```

Add the following:

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

Start the service:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup debian
```

## 5. Front-end application deployment

### 5.1 Clone front-end code

```bash
cd /var/www/jobtrip
git clone https://github.com/your-organization/jobtrip-frontend.git frontend
cd frontend
```

### 5.2 Install dependencies and build

```bash
npm install
```

### 5.3 Environment variable configuration

Create .env.production file:

```bash
vim .env.production
```

Add the following:

```
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_ENV=production
```

### 5.4 Building the application

```bash
npm run build
```

## 6. Nginx configuration

### 6.1 Install Nginx

```bash
sudo apt install -y nginx
```

### 6.2 Configure Nginx

Create configuration file:

```bash
sudo vim /etc/nginx/sites-available/jobtrip
```

Add the following:

```nginx
# Backend API service
upstream backend_servers {
    server 127.0.0.1:8080;
}

server {
    listen 80;
    server_name yourdomain.com;

# Redirect to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

# SSL certificate configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

# Security related header information
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Front-end application
    location / {
        root /var/www/jobtrip/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

# API request proxy
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

# Static resource cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        root /var/www/jobtrip/frontend/build;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }
}
```

Enable configuration:

```bash
sudo ln -s /etc/nginx/sites-available/jobtrip /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 Configure SSL certificate

Use Certbot to obtain an SSL certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 7. Security configuration

### 7.1 Configure automatic updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 7.2 Configure log rotation

```bash
sudo vim /etc/logrotate.d/jobtrip
```

Add the following:

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

### 7.3 Set file permissions

```bash
sudo chown -R www-data:www-data /var/www/jobtrip
sudo find /var/www/jobtrip -type d -exec chmod 755 {} \;
sudo find /var/www/jobtrip -type f -exec chmod 644 {} \;
```

## 8. Monitoring and Maintenance

### 8.1 Install monitoring tools

```bash
# Install Prometheus Node Exporter
sudo apt install -y prometheus-node-exporter

# Install MongoDB Exporter
sudo apt install -y prometheus-mongodb-exporter
```

### 8.2 Log monitoring

```bash
# View backend logs
pm2 logs jobtrip-backend

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 8.3 Create system health check script

```bash
sudo vim /opt/scripts/system-health.sh
```

Add the following:

```bash
#!/bin/bash

# Check service status
SERVICE_STATUS=$(systemctl is-active mongod redis-server nginx)
if [[ $SERVICE_STATUS == *"inactive"* ]]; then
echo "Warning: There is a service not running: $SERVICE_STATUS"
fi

# Check disk space
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
echo "Warning: Disk usage exceeds 80%: $DISK_USAGE%"
fi

# Check MongoDB connection
mongo_status=$(mongosh admin --quiet --eval "db.serverStatus().connections.current" || echo "Unable to connect")
if [[ "$mongo_status" == "Unable to connect" ]]; then
echo "Warning: MongoDB connection failed"
fi

# Check backend services
if ! pm2 list | grep -q "jobtrip-backend"; then
echo "Warning: Backend service is not running"
fi
```

Set execution permissions and add to scheduled tasks:

```bash
sudo chmod +x /opt/scripts/system-health.sh
echo "0 * * * * /opt/scripts/system-health.sh | mail -s 'System Health Check' admin@youremail.com" | sudo tee -a /etc/crontab
```

## 9. Troubleshooting common problems

### 9.1 MongoDB connection issues

If the backend cannot connect to MongoDB:

1. Check MongoDB service status:
   ```bash
   sudo systemctl status mongod
   ```

2. Confirm port listening:
   ```bash
   sudo ss -tulpn | grep 27017
   ```

3. Test database connection:
   ```bash
mongosh mongodb://jobtripapp:password@127.0.0.1:27017/jobtrip?authSource=admin
   ```

### 9.2 The backend service cannot be started

1. Check the log:
   ```bash
   pm2 logs jobtrip-backend
   ```

2. Verify environment variables:
   ```bash
   pm2 env jobtrip-backend
   ```

3. Check dependency installation:
   ```bash
   cd /var/www/jobtrip/backend
   npm ls
   ```

### 9.3 Front-end application issues

1. Verify Nginx configuration:
   ```bash
   sudo nginx -t
   ```

2. Check file permissions:
   ```bash
   ls -la /var/www/jobtrip/frontend/build
   ```

3. View Nginx error log:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

## Development environment configuration

### Development environment LAN access

If you need to access the development server from other devices within the LAN, follow these steps:

1. Set in the backend configuration file `.env`:
   ```
   HOST=0.0.0.0
   ```

2. Make sure the server's firewall allows inbound connections on the appropriate port:
   - Backend API service default port: 5000
   - Front-end development service default port: 3000

3. Get the IP address of the server (for example: 192.168.1.132)

4. On other devices within the LAN, access through a browser:
   ```
http://192.168.1.132:5000 # Backend API service
http://192.168.1.132:3000 # Front-end development service
   ```

5. API documentation can be accessed at:
   ```
   http://192.168.1.132:5000/api-docs  # Swagger UI
http://192.168.1.132:5000/docs # ReDoc (recommended)
   ```

Notice:
- If a different port is used, please adjust the access URL accordingly
- If the server is running, the service needs to be restarted to apply the new HOST configuration

---

This deployment guide provides basic steps for deploying JobTrip Career Assistant on a Debian 12 server. Additional configuration and adjustments may be required based on actual project needs. Be sure to use strong passwords and follow security best practices in your production environment.