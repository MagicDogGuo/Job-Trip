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

### ReDoc配置

同样，为了解决ReDoc的HTTPS问题，我们做了以下修改：

1. 修改了HTML模板中的资源引用，使用相对路径而不是绝对URL
2. 为ReDoc文档页面和JS资源添加了专用中间件
3. 设置了正确的内容类型和缓存控制头信息
4. 为ReDoc配置了适当的CSP，允许使用blob URL和Web Worker
5. 添加了HTML meta标签指定CSP，确保前端一致性

### CSP (内容安全策略) 配置

为了允许ReDoc正常工作，我们对CSP做了如下配置：

1. 添加了`script-src 'unsafe-eval' blob:`，允许动态执行脚本和使用blob URL
2. 添加了`worker-src blob:`，允许使用blob URL创建Web Worker
3. 在多个中间件中保持CSP一致，防止资源被阻止
4. 在HTML中添加了meta标签声明CSP，确保浏览器端一致

CSP配置示例：
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'
```

#### ReDoc和Web Worker问题

ReDoc使用Web Worker来提高性能，但必须通过blob URL加载这些Worker。如果CSP策略限制了blob URL或Web Worker，会出现如下错误：

```
SecurityError: Failed to construct 'Worker': Access to the script at 'blob:http://...' is denied by the document's Content Security Policy.
```

解决方案：
1. 在CSP中添加`worker-src blob:`
2. 在CSP中添加`script-src blob:`
3. 使用CSP帮助函数确保所有中间件和HTML设置一致的策略

### 资源自动检查

为确保所有必要的前端资源都可用，我们添加了资源检查脚本：

```bash
# 手动检查和下载必要资源
npm run check-resources
```

此脚本会自动：
1. 检查资源文件（如ReDoc的JS文件）是否存在
2. 如果不存在，尝试从CDN下载
3. 如果下载失败，尝试使用npm安装并复制文件
4. 所有dev命令都会自动运行此检查

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