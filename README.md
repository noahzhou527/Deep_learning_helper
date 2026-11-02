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
