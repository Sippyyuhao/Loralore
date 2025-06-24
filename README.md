# Loralore - 洛尔工作室官方网站

<div align="center">
  <img src="./images/favicon.png" alt="Loralore Logo" width="256">
  <p><em>创新驱动未来，技术成就梦想</em></p>
</div>

## 📌 项目概述

Loralore（洛尔工作室）是一个充满活力的跨校学生技术团队。我们致力于开发创新性技术解决方案，涵盖微信小程序、桌面应用、Web应用及算法研究等领域。本项目是工作室的官方网站，用于展示我们的团队理念、技术能力和项目成果。

### 🔗 在线预览

- **网站地址**：[https://loralore.netlify.app/](https://loralore.netlify.app/)  
- **更新频率**：持续迭代

## ✨ 网站特色

### 设计与体验
- **响应式布局**：完美适配从手机到大屏设备的各种屏幕尺寸。
- **现代化UI**：采用扁平化与微立体结合的设计风格，视觉效果简洁大方。
- **动态背景**：集成Particles.js打造动态粒子背景，提升视觉体验。
- **多主题支持**：内置多种风格的网站模板（简约、复古、二次元），可供展示和切换。

### 功能模块
- **交互式画廊**：使用多种方式创新性地展示项目。
- **动态访客计数**：基于 **Netlify Functions** 和 **Netlify Blobs** 实现的实时网站访问次数统计，无需依赖第三方服务。
- **安全联系表单**：后端由云函数驱动，可将表单信息安全地发送到指定邮箱，并能轻松扩展以进行数据存储和发出自动回复。
- **团队与项目展示**：全面介绍跨校团队的背景、价值观和详细的项目案例。
- **联系表单**：基于FormSpree的无后端表单解决方案
- **访问统计**：集成百度统计，实时监控网站访问数据
## 🛠️ 技术架构

### 前端技术
- **HTML5**：采用语义化标签构建清晰的页面结构。
- **CSS3**：
  - Flexbox 和 Grid 布局系统
  - 媒体查询实现响应式设计
  - CSS变量（Variables）管理主题色彩
  - CSS动画与过渡效果
- **JavaScript (ES6+)**：
  - 原生JS实现所有核心交互逻辑
  - DOM操作与事件处理
  - Fetch API进行异步数据请求

### 后端技术 (Serverless)
- **Netlify Functions**：使用云函数处理后端逻辑，如访客计数、表单提交等。
- **Netlify Blobs**：利用云存储服务持久化存储数据，如访客总数。

### 第三方库与工具
- **Particles.js**：粒子效果背景
- **Font Awesome 4.7.0**：图标库
- **FormSpree**：表单处理服务
- **百度统计**：网站数据分析

### 开发与部署
- **Git & GitHub**：进行版本控制和团队协作。
- **VSCode**：作为主要的开发编辑器。
- **Netlify CLI**：在本地环境模拟、调试云函数及完整部署环境。

## 📂 项目结构

```
Sippy_5_web/
├── index.html              # 网站主页
├── netlify.toml            # Netlify 配置文件 (重定向, 插件等)
├── package.json            # 项目依赖与脚本
│
├── css/                    # 主样式文件夹
│   └── style.css
├── js/                     # 主JavaScript文件夹
│   └── script.js
├── images/                 # 公共图片资源
│
├── netlify/                # Netlify平台特定文件
│   └── functions/          # 云函数目录
│       └── visitor-count.js
│
├── 二次元风格/               # ACG风格网站模板
├── 复古风格/                 # 复古风格网站模板
└── 简约风格/                 # 简约风格网站模板
```

## 🚀 本地开发指南

项目包含云函数，需要使用`Netlify CLI`进行本地开发。

### 环境准备
- [Node.js](https://nodejs.org/) (建议使用LTS版本)
- [Git](https://git-scm.com/)
- 现代浏览器 (Chrome, Firefox, Edge等)
- 文本编辑器 (推荐VSCode)

### 安装与运行
```bash
# 1. 克隆仓库到本地
git clone https://github.com/Sippyyuhao/Loralore.git

# 2. 进入项目目录
cd Loralore  # 或者你的项目文件夹名

# 3. 安装项目依赖
npm install

# 4. 安装Netlify CLI (如果尚未安装)
npm install -g netlify-cli

# 5. 启动本地开发服务器
# 这会同时运行前端页面和云函数
netlify dev
```
之后，浏览器会自动打开一个本地地址 (通常是 `http://localhost:8888`)，你可以在此进行开发和调试。

## 📤 部署流程

本项目已配置为通过 **Netlify** 进行持续部署。

1. **首次部署**:
   - 在 [Netlify](https://www.netlify.com/) 官网上用你的 GitHub 账户登录。
   - 选择 "Add new site" -> "Import an existing project"。
   - 授权 Netlify 访问你的 GitHub 仓库并选择本项目。
   - Netlify 会自动识别出 `netlify.toml` 和 `package.json`，无需额外配置，直接点击 "Deploy site"。

2. **后续更新**:
   部署一次之后，你只需要将新的代码推送到GitHub的 `main` 分支，Netlify就会自动抓取最新代码并完成构建和部署。
   ```bash
   git add .
   git commit -m "描述你的更新内容"
   git push origin main
   ```

## 👥 团队成员

Loralore是一支充满活力的跨校学生团队，成员来自：
- **广东海洋大学**
- **广东外语外贸大学**
- **华南师范大学**

## 📞 联系我们

- **开发者邮箱**：2684373547@qq.com
- **工作室邮箱**：sippyyuhao@hotmail.com
- **GitHub 主页**：[https://github.com/Sippyyuhao](https://github.com/Sippyyuhao)

## 📜 版权与许可

该项目采用 [ISC License](./LICENSE) 开源许可证。

---

<div align="center">
  <p>用创意改变世界 | 技术驱动未来 | 跨校合作共赢</p>
</div> 