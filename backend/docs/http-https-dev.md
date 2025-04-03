# 开发环境中HTTP和HTTPS管理

## 问题背景

在开发环境中，有时我们会遇到浏览器尝试通过HTTPS请求资源，但服务器配置为HTTP服务的情况。这通常发生在以下情况：

1. 浏览器被设置为强制使用HTTPS
2. 网站使用了HSTS（HTTP严格传输安全）头，迫使浏览器使用HTTPS
3. Swagger UI或其他第三方库尝试通过HTTPS加载资源

## 解决方案

### 开发环境

我们提供了专门的开发服务器脚本，确保所有资源都通过HTTP提供：

```bash
# 使用HTTP开发服务器
npm run dev:http
```

这将启动一个开发服务器，该服务器：
- 禁用了HSTS头
- 配置了适当的CSP（内容安全策略）头
- 为Swagger UI提供本地CSS和JS文件
- 记录所有HTTP请求和错误

### Swagger UI配置

为了解决Swagger UI的HTTPS问题，我们做了以下修改：

1. 为Swagger UI提供了专门的中间件，设置正确的头信息
2. 添加了路由直接从node_modules提供Swagger UI的资源
3. 修改了Swagger UI的配置，确保使用相对路径

### 生产环境

在生产环境中，建议：

1. 使用适当的SSL证书配置HTTPS
2. 设置HTTP到HTTPS的重定向
3. 配置适当的安全头信息

## HTTPS本地开发（可选）

如果需要在本地使用HTTPS进行开发：

1. 生成自签名证书：

```bash
mkdir -p certs
openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes
```

2. 在`src/index.ts`中添加HTTPS服务器配置（已注释掉的代码）

3. 修改环境变量以启用HTTPS：
```
ENABLE_HTTPS=true
```

4. 运行带HTTPS的开发服务器：
```bash
npm run dev
```

注意：使用自签名证书时，浏览器会显示安全警告。这是正常的，你可以在开发环境中手动接受证书。

## 开发技巧

- 使用Chrome开发者工具查看和调试网络请求
- 检查请求头和响应头以诊断问题
- 使用浏览器的Network面板筛选请求，查找错误
- 检查服务器日志（位于`logs/`目录） 