---
name: run-dev
description: 启动本地开发服务器、验证服务是否运行、或查看端口状态时使用。
---

# 启动开发服务器

## 概述

Webpack 开发服务器，端口 8181，支持热更新。CSS 通过 sass-loader 从 SCSS 编译。

## 启动

```bash
npm run dev
```

实际执行命令：`NODE_OPTIONS=--openssl-legacy-provider webpack-dev-server --open --port 8181`

访问地址：**http://localhost:8181**

## 验证是否运行

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:8181
# 返回 200 表示正常
```

## 已知警告（可忽略）

启动时会出现 Sass `mixed-decls` 废弃警告 —— 来自 `src/main.scss` 中选择器内嵌套了 `@media print` 块，不影响功能。

## 端口被占用

若 8181 端口已被占用，说明服务已在运行，直接打开 http://localhost:8181 即可。

## 生产构建

```bash
npm run build        # 输出到 docs/
npm run generate-pdf # 通过 puppeteer 生成 docs/lianghuaibin.pdf
```
