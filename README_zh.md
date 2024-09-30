<p align="center">
    <img style="width: 240px" width="240" src="./public/images/Logo.svg" alt="logo">
</p>
<h3 align="center">good.news</h3>
<h5 align="center">
    <a href="./README.md">English</a>,
    <a href="./README_zh.md">中文</a>
</h5>

good.news 是一个基于 ActivityPub 协议开发的自由、开源的社交媒体平台。通过 good.news，你可以自由地发布各种内容，包括文字、图片、链接和视频等。作为 ActivityPub 生态系统的一部分，good.news 支持与其他实现该协议的平台/服务器上的用户和内容互动。

主要特点和技术亮点：

1. 高效的后端架构：后端使用 PHP、Swoole 和 Hyperf 开发，部署便捷、易于定制，并且性能卓越。
2. 开发活跃：good.news 目前处于积极开发的阶段，能够及时响应并解决问题，同时也在积极开发新的功能。
3. SEO 友好：前端采用了 Nuxt.js，并针对搜索引擎进行了优化，使内容更容易被搜索引擎收录。
4. 兼容 Mastodon API：good.news 兼容绝大多数常用的 Mastodon API，用户可以使用支持 Mastodon 协议的应用程序访问。此外，good.news 也提供了开源 Flutter 客户端。

## 环境准备

### 必要工具

在开始部署之前，请确保你的环境中安装了以下工具：

- **Node.js**：推荐版本 18.x 或更高版本
- **NPM/Yarn/PNPM**：用于管理项目依赖

### 安装依赖

在项目根目录下运行以下命令以安装依赖:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## 启动开发服务器

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

启动完成后，在浏览器中打开 `http://localhost:3000`

## 部署到服务器

### 构建应用

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

构建完成后，会生成 .output 文件夹，其中包含应用的构建文件。:

### 上传文件到服务器

将构建好的代码包上传到服务器。你可以选择以下任意一种方式：

    •	SCP：scp -r .output/ user@your-server-ip:/path/to/your/app
    •	Git：将项目推送到 Git 仓库并在服务器上拉取
    •	FTP：使用 FTP 工具上传文件

### 启动应用

你可以使用 PM2 管理应用：

```bash
# 在服务器上安装 PM2
npm install pm2 -g
# 启动应用
pm2 start .output/server/index.mjs --name "my-app"
# 设置 PM2 开机自启动：
pm2 startup
pm2 save
```

如果您需要自定义配置 PM2，需要将 ecosystem.config.cjs 文件 copy 后重命名为 ecosystem.config，后执行

```bash
pm2 start ecosystem.config.cjs
```

## 部署到 Cloudflare

_如果使用 CloudFlare 部署的话，需要确保项目的根目录有.env.prod 文件，你可以从.env.example 文件拷贝后重命名_

### 构建应用

```bash
# npm
npm run build:cfpage

# pnpm
pnpm run build:cfpage

# yarn
yarn build:cfpage
```

### 上传到 Cloudflare Pages

部署时，它会首次要求你创建一个项目：

```bash
npx wrangler pages deploy dist/
```

## 总结

通过以上步骤，你应该能够成功启动或部署本应用。如果有任何问题，欢迎提交 Issue 进行反馈。
