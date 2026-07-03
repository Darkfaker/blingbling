# BBL 微信个人工具箱

一个小而可靠的微信工具工作台，包含待办、番茄钟、二维码和阅读。

## 当前能力

- 首页：2×2 工具入口、最近使用和设置。
- 待办：新增、完成、删除；无云环境时使用本地模式，配置后使用私有云集合。
- 番茄钟：绝对时间戳计时，支持暂停、恢复、切后台和冷启动恢复。
- 二维码：UTF-8 字节限制、本地生成、复制与保存相册。
- 阅读：未配置云环境时展示安全示例；部署同步函数后读取 Hacker News 官方 API 的公开链接。

## 环境要求

- Node.js 20 或更高版本
- pnpm 11
- 微信开发者工具
- 需要云同步时：正式小程序 AppID 与微信云开发环境

## 开始开发

```bash
pnpm install --frozen-lockfile
pnpm dev:weapp
```

然后用微信开发者工具导入仓库根目录。默认 `project.config.json` 使用游客 AppID，只适合本地能力预览。

## 启用云能力

1. 把 `project.config.json` 的 `appid` 换成自己的小程序 AppID；个人私有配置也可以写入被忽略的 `project.private.config.json`。
2. 复制 `.env.example` 为 `.env.local`，填写 `TARO_APP_CLOUD_ENV`。
3. 按 [云环境部署说明](docs/runbooks/cloud-setup.md) 创建集合、配置权限并部署 `syncReading`。
4. 重新运行 `pnpm build:weapp`。

不要提交 AppSecret、云密钥、完整 openid 或真实用户内容。

## 质量检查

```bash
pnpm check
```

该命令运行类型检查、ESLint、单元测试、Manifest/路由一致性检查和微信生产构建。当前核心领域逻辑有 27 个单元测试。

## 目录

```text
src/features/       按工具组织的页面、模型与仓储
src/shared/         平台适配、UI 和错误模型
cloudfunctions/     微信云函数
cloud/rules/        数据库安全规则参考文件
docs/decisions/     技术决策记录
docs/runbooks/      部署与回滚操作说明
docs/qa/            验收记录
```

产品与架构依据见 [v2 设计文档](docs/superpowers/specs/2026-07-02-wechat-toolbox-design.md)，任务拆解见 [实施计划](docs/superpowers/plans/2026-07-03-wechat-toolbox-implementation-plan.md)。
