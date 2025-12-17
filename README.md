# 双人计划与进度追踪应用

一个帮助两人共同制定计划、追踪进度并相互激励的Web应用。

## 功能特性

- 支持两人独立的短期和长期计划管理
- 成就系统：通过完成任务获得星星，积累星星兑换太阳
- 月度目标设定：每月完成3个太阳即可获得奖励
- 实时数据同步：通过URL参数实现数据共享
- 主题切换：支持明暗两种主题
- 背景自定义：可以更换应用背景图片

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion（动画效果）
- React Router（路由）

## 部署指南

### 前置条件

- Git
- Node.js（建议v16+）
- pnpm（或npm/yarn）
- GitHub账号
- Netlify账号

### 本地开发

1. 克隆仓库
   ```bash
   git clone https://github.com/your-username/shared-plan-tracker.git
   cd shared-plan-tracker
   ```

2. 安装依赖
   ```bash
   pnpm install
   ```

3. 启动开发服务器
   ```bash
   pnpm dev
   ```
   应用将在 http://localhost:3000 启动

### 部署到Netlify

1. 将代码推送到GitHub

2. 在Netlify上部署
   - 登录Netlify账号
   - 点击"New site from Git"
   - 选择GitHub，并授权访问您的仓库
   - 选择要部署的仓库
   - 配置部署设置：
     - Build command: `pnpm build`
     - Publish directory: `dist/static`
   - 点击"Deploy site"

3. 等待部署完成后，您将获得一个Netlify提供的URL

## 数据同步说明

由于这是一个纯前端应用，数据同步通过以下方式实现：

1. **本地存储**：每个用户的浏览器会保存自己的数据
2. **URL参数同步**：通过生成包含所有数据的分享链接，实现两人之间的数据同步
   - 点击分享按钮获取最新的同步链接
   - 将链接发送给对方，对方打开链接后即可看到最新数据
   - 在Netlify部署环境中，每次数据变更会自动更新URL参数

## 注意事项

- 数据仅保存在本地浏览器和URL参数中，请妥善保管分享链接
- 每个月1号会自动重置当月成就数据，并将成就记录到历史记录中
- 如果数据量过大，分享链接可能会被浏览器或某些平台截断，请定期清理不必要的计划

## 贡献

欢迎提交Issue和Pull Request来改进这个应用！