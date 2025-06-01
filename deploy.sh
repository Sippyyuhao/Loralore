#!/bin/bash

# 部署到GitHub Pages的脚本
# 确保你已经有GitHub仓库并配置了SSH密钥

# 显示脚本执行步骤
set -e

echo "开始部署到GitHub Pages..."

# 获取当前时间作为提交信息
CURRENT_TIME=$(date "+%Y-%m-%d %H:%M:%S")
COMMIT_MESSAGE="站点更新: ${CURRENT_TIME}"

# 检查git状态
if [ -z "$(git status --porcelain)" ]; then
  echo "没有变更需要提交"
  exit 0
fi

# 添加所有文件到暂存区
git add -A

# 提交变更
git commit -m "${COMMIT_MESSAGE}"

# 推送到GitHub仓库的主分支
echo "推送代码到GitHub..."
git push -u origin main

echo "部署完成!" 