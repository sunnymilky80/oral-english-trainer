# Oral English Trainer · 30-Day Challenge

30天求职英语口语训练工具，配合 Gemini Live 语音对话进行系统性口语训练。

## 功能

- 📋 每日任务面板（30天结构化计划）
- 🎧 影子跟读（内嵌 YouTube 播放器 + 笔记区）
- 🎤 AI 语音对话练习（Gemini Live / Claude App）
- 💡 Topic 收集箱（随时记录想练的话题）
- ✦ 表达积累本（记录卡壳表达）
- 📊 进度追踪（打卡、连续天数、完成率）

## 部署到 Vercel

### 方式一：GitHub + Vercel（推荐）

1. 在 GitHub 创建一个新仓库
2. 把这个项目 push 上去：
   ```bash
   git init
   git add .
   git commit -m "init: oral english trainer"
   git remote add origin https://github.com/你的用户名/oral-english-trainer.git
   git push -u origin main
   ```
3. 打开 [vercel.com](https://vercel.com)，用 GitHub 账号登录
4. 点击 "New Project" → 选择刚才的仓库 → Deploy
5. 等待几十秒，部署完成后会给你一个 URL

### 方式二：Vercel CLI

```bash
npm install -g vercel
cd oral-english-trainer
vercel
```

## 本地开发

```bash
npm install
npm run dev
```

打开 http://localhost:5173 即可预览。

## 技术栈

- React 18
- Vite 5
- localStorage 数据持久化
- 无后端、无数据库
