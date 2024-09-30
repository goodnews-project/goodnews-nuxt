<p align="center">
    <img style="width: 240px" width="240" src="./public/images/Logo.svg" alt="logo">
</p>
<h3 align="center">good.news</h3>
<h5 align="center">
    <a href="./README.md">English</a>,
    <a href="./README_zh.md">中文</a>
</h5>

good.news is a free, open-source social media platform developed based on the ActivityPub protocol. Through good.news, you can freely publish various types of content, including text, images, links, and videos. As part of the ActivityPub ecosystem, good.news supports interaction with users and content on other platforms/servers that implement this protocol.

Key features and technical highlights:

1. Efficient backend architecture: The backend is developed using PHP, Swoole, and Hyperf, making it easy to deploy and customize, with excellent performance.
2. Active development: good.news is currently in an active development stage, capable of promptly responding to and resolving issues, while also actively developing new features.
3. SEO-friendly: The frontend uses Nuxt.js and has been optimized for search engines, making content easier to be indexed by search engines.
4. Compatible with Mastodon API: good.news is compatible with most commonly used Mastodon APIs, allowing users to access it using applications that support the Mastodon protocol. Additionally, good.news also provides an open-source Flutter client.

## Environmental preparation

### Necessary tool

Before you start deploying, make sure you have the following tools installed in your environment:

- **Node.js**: Version 18.x or later is recommended
- **NPM/Yarn/PNPM**: Used to manage project dependencies

### Installation dependency

Run the following command under the project root to install the dependency:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Start the development server

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

When startup is complete, open 'http://localhost:3000' in your browser

## Deploy to server

### Build application

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

After the build is complete, the.output folder is generated, which contains the build files for the application. :

### Upload files to the server

Upload the built project to the server. You can choose any of the following:

    •	SCP：scp -r .output/ user@your-server-ip:/path/to/your/app
    •	Git: Push the project to the Git repository and pull it on the server
    •	FTP: Use the FTP tool to upload files

### Start application

You can use the PM2 management application:

```bash
# Install PM2 on the server
npm install pm2 -g
# Start application
pm2 start .output/server/index.mjs --name "my-nuxt3-app"
# Set the PM2 to start automatically when it is powered on:
pm2 startup
pm2 save
```

If you need to customize the PM2 configuration, copy the ecosystem.config.cjs file and rename it to ecosystem.config

```bash
pm2 start ecosystem.config.cjs
```

## Deploy to Cloudflare

_If you use CloudFlare deployment, you need to make sure that the root directory of the project has a.env.prod file, which you can copy from the.env.example file and rename_

### Build application

```bash
# npm
npm run build:cfpage

# pnpm
pnpm run build:cfpage

# yarn
yarn build:cfpage
```

### Upload to Cloudflare Pages

Deploy, it will ask you to create a project for the first time:

```bash
npx wrangler pages deploy dist/
```

## Sum up

With the above steps, you should be able to launch or deploy your owl application successfully. If you have any questions, please submit an Issue for feedback.
