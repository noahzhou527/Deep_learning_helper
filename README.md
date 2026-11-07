# AI 架构实验室

统一的私人深度学习网站，合并 Transformer 一图懂与 Neural Notes 神经网络复习内容。

- 主站：https://transformer-study-map.weichunzhou527.chatgpt.site
- 源码：https://github.com/noahzhou527/Deep_learning_helper
- `/`、`/learn`：全部学习专题
- `/transformer-map`：Transformer 概念地图
- `/gpt`、`/bert`、`/gan`、`/reinforcement-learning`：架构专题
- `/review`：FNN、CNN、RNN、注意力手算与 Transformer Block 总复习

旧 Neural Notes 域名仅作为跳转入口，其页面源码保存在 `legacy-site/`。原首页及锚点转到主站 `/review`，其他课程路径保持对应关系。

## 本地开发

需要 Node.js >=22.13.0，使用已有 pnpm lockfile：

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm build
node --test tests/rendered-html.test.mjs
```

## 同步与发布

`origin/main` 是 GitHub 源码仓库。Sites 主站身份保存在 `.openai/hosting.json`，发布时使用 Sites 的源码同步、打包和部署流程；部署提交同时推送 GitHub，保持同一提交。GitHub 推送本身不代表线上已部署，也未配置自动部署。

两个域名均保留仅所有者可访问的设置。更新主站后无需再次维护旧站课程；只有主站域名或路由变化时才需要更新跳转页面。

## 跨项目学习入口（本地开发）

本项目 A 默认访问 http://localhost:4000/（`pnpm dev`）。项目 B 默认访问 http://127.0.0.1:5190/（在 B 中运行 `npm run dev`）。

- `config/course-links.json` 的 `llmBaseUrl` 是 B 的基础地址，由服务端读取并传给页面；组件不保存目标主机地址。
- 基础地址可含部署子路径；课程路径以相对地址拼接，自动处理尾部斜杠。
- 开发端口变化时，调整本项目 dev 启动参数，以及对方项目指向本项目的课程配置。
- 发布前将课程配置换为实际部署地址，执行 `pnpm build` 并验证两条入口及访问权限；不应向线上用户提供 localhost 地址。
- A 展示通用架构和概念；B 承担数值计算与推理系统专题。Post-LN / Pre-LN 和人工示意数据均在相关章节标明。
