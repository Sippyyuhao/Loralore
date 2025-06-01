# Loralore - 洛尔科技工作室官网

这是洛尔科技工作室的官方网站项目，展示我们的团队、项目和技术能力。

## 网站特点

- 响应式设计，适配各种设备
- 3D旋转画廊项目展示
- 跨校团队介绍
- 项目详情展示

## 技术栈

- HTML5
- CSS3
- 原生JavaScript
- Particles.js 背景效果

## 本地开发

克隆项目后可直接在浏览器打开 `index.html` 文件查看效果。

```bash
# 克隆仓库
git clone https://github.com/yourusername/Loralore.git

# 进入项目目录
cd Loralore

# 使用浏览器打开
# 在Windows上
start index.html
# 在macOS上
open index.html
# 在Linux上
xdg-open index.html
```

## 部署

该网站托管在GitHub Pages上。如需部署最新版本，可使用以下方法：

### 自动部署

使用仓库中的部署脚本：

```bash
chmod +x deploy.sh  # 赋予执行权限（首次使用）
./deploy.sh         # 执行部署
```

### 手动部署

```bash
# 添加所有变更
git add .

# 提交变更
git commit -m "更新网站内容"

# 推送到GitHub
git push origin main
```

## 许可证

版权所有 © 2025 Loralore 洛尔科技工作室 