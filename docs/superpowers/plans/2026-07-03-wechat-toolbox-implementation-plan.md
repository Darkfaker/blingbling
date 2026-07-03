# 微信个人工具箱 v0.1 实施计划

> 对应设计：[2026-07-02-wechat-toolbox-design.md](../specs/2026-07-02-wechat-toolbox-design.md)
>
> 当前仓库只有设计文档。本计划从风险验证开始，不假设脚手架、AppID、云环境或内容源已经存在。

## 1. 交付目标

交付一个微信小程序体验版，包含首页、设置、待办、番茄钟、二维码和阅读四个模块。若阅读内容源未通过 P0 门槛，则按设计文档替换为纯本地“文本暂存”工具，不阻塞首版发布。

完成定义：

- `pnpm check` 一次完成类型、lint、单元测试、manifest 校验和生产构建。
- 微信开发者工具可以导入构建产物，至少一台 iPhone 和一台 Android 通过核心路径。
- 云数据权限完成“本人允许、他人拒绝”的验证。
- 四个核心任务满足设计文档中的交互和恢复要求。
- 仓库包含环境配置说明、部署步骤、真机验收表和回滚步骤。

## 2. 工作原则

1. 每个阶段都从失败测试或可验证检查开始。
2. 每个提交只表达一个可回滚的意图。
3. P0 spike 是可抛弃代码，不在结论明确前搭正式架构。
4. 不提前实现完整离线队列、自建后端适配、第三方插件或多端兼容。
5. 涉及微信生命周期、Canvas、权限和云开发的结论必须来自真机或真实环境，H5 结果不能替代。

## 3. 开工输入

开始 P0 前收集，但缺少某一项时仍可推进其余任务：

- 微信小程序 AppID；若没有，先用测试号验证非云能力。
- 云开发环境 ID，以及开发/体验成员权限。
- 目标微信最低基础库版本。
- 阅读候选来源的 URL、许可说明、更新频率和内容格式。
- 至少一台 iOS 与一台 Android 测试设备。

敏感配置不得提交。仓库只保存 `.env.example` 或等价模板。

---

## 4. P0：风险验证与技术决策

### 任务 0.1：建立决策与验证目录

**新增文件**

- `docs/decisions/0001-framework.md`
- `docs/decisions/0002-cloud-identity.md`
- `docs/decisions/0003-qrcode-renderer.md`
- `docs/decisions/0004-reading-source.md`
- `docs/qa/p0-evidence.md`
- `.gitignore`

**步骤**

1. 为每份 ADR 写入相同章节：背景、候选、验证方法、证据、决定、后果。
2. 在 `p0-evidence.md` 建立设备、微信版本、基础库版本、操作步骤、结果和截图路径字段。
3. `.gitignore` 排除环境变量、微信私有项目配置、构建产物和 spike 临时目录。
4. 运行 `git diff --check`。

**完成标准**

- 四项决策都有可填写模板。
- 验证证据能够复现，而不是只有“可用”结论。

**建议提交**：`docs: add P0 decision and evidence templates`

### 任务 0.2：Taro 最小 spike

**临时目录**：`spikes/taro-weapp/`

**步骤**

1. 使用当日稳定版本初始化 Taro + React + TypeScript 项目，并精确锁定版本。
2. 只建立首页和一个详情页，验证编译、导航、返回与页面生命周期。
3. 添加一个纯函数测试，确认测试工具链可运行。
4. 构建生产包，记录主包大小、冷启动主观结果和所有平台补丁。
5. 在微信开发者工具和至少一台真机运行。
6. 将命令、版本、产物大小和异常写入 `p0-evidence.md`。

**通过门槛**

- 无修改框架源码、魔改构建产物或无法解释的兼容补丁。
- 页面导航和 `onShow/onHide` 真机行为正常。
- TypeScript、测试和生产构建命令稳定复现。

### 任务 0.3：微信原生 TypeScript 对照 spike

**临时目录**：`spikes/native-weapp/`

**步骤**

1. 创建同样的首页、详情页和生命周期日志。
2. 记录开发体验、产物大小、依赖复杂度和测试接入成本。
3. 不做完整 UI，只收集与 Taro 选择相关的差异。
4. 更新 `0001-framework.md`，按“真机可靠性、开发效率、测试、包体、补丁成本”评分。

**决策规则**

- Taro 通过任务 0.2 且没有明显平台补丁时选 Taro。
- Taro 核心能力失败、包体不可接受或需要维护非标准补丁时选原生 TypeScript。
- ADR 写清失败条件与重新评估时机，不写“因为更流行”。

**建议提交**：`spike: compare Taro and native WeChat runtimes`

### 任务 0.4：云身份与权限 spike

**临时目录**：沿用胜出框架的 spike。

**步骤**

1. 建立测试集合 `p0_private_records`，使用“仅创建者可读写”或等价安全规则。
2. 小程序启动后获取平台身份状态，不请求昵称或头像。
3. 设备 A 创建一条记录并成功读取、更新、删除。
4. 使用另一微信身份 B 验证无法读取或修改 A 的记录。
5. 断网和权限拒绝时捕获结构化错误，确认不会泄漏敏感配置。
6. 记录是否需要独立 login 云函数、前端查询是否必须显式带用户条件，以及安全规则配置方式。
7. 更新 `0002-cloud-identity.md`。

**通过门槛**

- 本人 CRUD 成功，其他身份读取和修改均失败。
- 不需要用户可见登录页。
- 权限规则可以版本化或有确定、可复现的部署步骤。

**建议提交**：`spike: verify cloud identity and private data rules`

### 任务 0.5：二维码 spike

**步骤**

1. 比较不超过两个候选实现，避免无边界选型。
2. 验证 ASCII、中文、emoji、URL 和接近 500 字节输入。
3. 输出 1024×1024 白底图片，验证静区、保存相册和权限拒绝流程。
4. 分别使用微信扫码、iOS 相机和 Android 相机扫描。
5. 记录依赖体积、Canvas API、编码方式、最大可靠输入和失败表现。
6. 更新 `0003-qrcode-renderer.md`。

**通过门槛**

- 三种扫码入口均识别规定样本。
- 相册首次授权、已授权和拒绝后重试均有确定行为。
- 候选实现不要求后端上传用户内容。

**建议提交**：`spike: validate QR rendering and image export`

### 任务 0.6：阅读数据源 spike

**步骤**

1. 记录候选源的许可、robots/使用条款、格式、更新频率和限流。
2. 用一次最小服务端请求解析 20 条数据，检查稳定 id、标题、URL、发布时间和正文/摘要可用性。
3. 连续执行两次，验证可构造幂等键且第二次不会产生重复记录。
4. 模拟来源失败，确认旧缓存策略可成立。
5. 明确允许保存的最小字段；不确定时只保存链接和自写摘要。
6. 更新 `0004-reading-source.md`，结论只能是“采用某源”或“v0.1 替换阅读”。

**通过门槛**

- 来源身份明确、许可可接受、字段稳定、请求限制满足预计使用量。
- 无结论即视为未通过，不以“以后再找”进入正式开发。

**建议提交**：`spike: decide v0.1 reading source`

### 任务 0.7：P0 评审和清理

**步骤**

1. 完成四份 ADR，不能保留多个“推荐选项”。
2. 在设计文档中更新已验证的具体选择和限制。
3. 删除失败框架 spike；保留必要的证据或最小复现，不把 spike 当正式代码继续堆。
4. 写 `docs/qa/p0-summary.md`，列出通过项、失败项、替代方案和正式脚手架命令。
5. 运行 `git diff --check`。

**P0 退出标准**

- 框架、云身份方案、二维码实现和阅读/替代工具均已唯一确定。
- 任何失败项都有已触发的降级方案。

**建议提交**：`docs: record P0 architecture decisions`

---

## 5. P1：正式工程与工作台骨架

> 以下路径以 Taro 胜出为默认示例。若 ADR 选择原生，保持 feature 边界和文件责任不变，页面文件按原生约定落位。

### 任务 1.1：创建正式项目

**新增/修改**

- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- ESLint/格式化/测试配置
- `src/app.tsx`
- `src/app.config.ts`
- `.env.example`
- `README.md`

**步骤**

1. 从 ADR 锁定的版本创建干净项目，不复制 spike 中的实验代码。
2. 定义脚本：`dev:weapp`、`build:weapp`、`typecheck`、`lint`、`test`、`validate`、`check`。
3. 先让 `pnpm check` 因缺少 manifest 校验而失败。
4. 加入最小校验占位实现，使 `pnpm check` 通过。
5. 在 README 写安装、配置、开发与构建命令。

**完成标准**：新克隆后按照 README 能构建空首页。

**建议提交**：`build: initialize verified WeChat mini-program stack`

### 任务 1.2：建立工具 manifest 和路由校验

**新增/修改**

- `src/features/registry.ts`
- `src/features/registry.test.ts`
- `scripts/validate-manifests.ts`
- `src/app.config.ts`

**测试先行**

1. 写失败测试：重复 id 被拒绝。
2. 写失败测试：非法 route 被拒绝。
3. 写失败测试：manifest route 不在页面配置中时校验失败。
4. 实现最小类型、静态清单和校验脚本。
5. 加入首页、设置和四个工具的占位页面路由。
6. 运行 `pnpm check`。

**完成标准**：入口清单与页面配置不一致时 CI 必然失败。

**建议提交**：`feat: add typed tool registry and route validation`

### 任务 1.3：建立工具生成器

**新增**

- `scripts/create-tool.ts`
- `scripts/create-tool.test.ts`
- `src/features/_template/` 或脚本内模板资源

**测试先行**

1. 测试非法工具 id 不写文件。
2. 测试已存在目录不覆盖。
3. 测试生成页面、模型和测试骨架。
4. 实现生成器，再手动生成一个临时工具验证。
5. 删除临时工具并确认工作树恢复干净。

**完成标准**：从输入 id 到可打开占位页不超过 30 分钟，且不需要复制粘贴旧模块。

**建议提交**：`build: add safe tool module generator`

### 任务 1.4：共享 UI 与页面状态

**新增**

- `src/shared/ui/Button/`
- `src/shared/ui/Card/`
- `src/shared/ui/StateView/`
- `src/shared/ui/Toast/`
- 对应测试

**步骤**

1. 先写 `StateView` 的 loading、empty、retryable error 和 forbidden 测试。
2. 实现最小组件，不引入整套 UI 库。
3. Button 支持 loading/disabled 并阻止重复点击。
4. 统一 8pt 间距、颜色、字号和可点击区域 token。
5. 占位页全部使用通用状态组件。

**建议提交**：`feat: add minimal shared UI and state components`

### 任务 1.5：首页、最近使用与设置

**新增/修改**

- `src/pages/home/index.tsx`
- `src/pages/home/index.scss`
- `src/pages/home/index.test.tsx`
- `src/pages/settings/index.tsx`
- `src/shared/platform/storage.ts`
- `src/shared/platform/storage.test.ts`

**测试先行**

1. 测试首页只渲染 `ready/beta` 工具。
2. 测试点击工具记录最近使用并导航。
3. 测试未知或已移除 `toolId` 被安全忽略。
4. 测试损坏 Storage 回退默认状态。
5. 实现首页 2×2 网格、最近使用卡片和设置入口。
6. 设置页加入数据与隐私说明、清缓存、版本信息和开发版诊断入口。

**完成标准**：任意工具两次点击内可达，损坏缓存不导致白屏。

**建议提交**：`feat: build toolbox home and settings`

### 任务 1.6：错误模型与最小日志

**新增**

- `src/shared/observability/AppError.ts`
- `src/shared/observability/logger.ts`
- 对应测试

**测试先行**

1. SDK/未知错误能映射为稳定错误码和用户文案。
2. 日志会剔除 openid、待办标题、二维码内容和文章正文。
3. 开发诊断信息只包含允许字段。
4. 将页面错误状态接入该模型。

**建议提交**：`feat: normalize errors and redact diagnostic logs`

---

## 6. P2：本地工具

### 任务 2.1：番茄钟领域模型

**新增**

- `src/features/pomodoro/model.ts`
- `src/features/pomodoro/model.test.ts`
- `src/features/pomodoro/repository.ts`

**测试先行用例**

- idle → running → paused → running → completed。
- 切后台 1 分钟后按绝对时间恢复。
- 杀进程后运行态恢复。
- 暂停态重启仍暂停。
- 跨越结束时间只产生一次 completed。
- 系统时钟回拨时不产生负剩余时间。
- 损坏或旧 schema 数据回退默认值。

实现纯函数 reducer 与 `remainingMs(state, now)`，通过后再接 Storage。禁止把 `setInterval` 计数作为真实状态。

**建议提交**：`feat: implement timestamp-based pomodoro model`

### 任务 2.2：番茄钟页面

**新增/修改**

- `src/features/pomodoro/pages/index.tsx`
- 页面样式与测试
- `src/shared/platform/notifications.ts`

**步骤**

1. 组件测试覆盖开始、暂停、继续、重置和下一阶段。
2. 接入页面定时刷新，但每次从绝对时间计算。
3. 在 `onShow` 恢复，在状态变化时持久化。
4. 活跃状态完成时震动与 Toast；失败不影响状态迁移。
5. 真机验证后台 1/30 分钟和杀进程。

**建议提交**：`feat: add resilient pomodoro experience`

### 任务 2.3：二维码输入与编码规则

**新增**

- `src/features/qrcode/model.ts`
- `src/features/qrcode/model.test.ts`
- `src/features/qrcode/renderer.ts`

**测试先行用例**

- UTF-8 字节数计算正确。
- 空输入不渲染。
- 500 字节边界允许，超限拒绝。
- 250ms 防抖只提交最后一次输入。
- 渲染错误映射为可恢复错误。

renderer 只封装 ADR 选定实现，不建立第二个虚假后端实现。

**建议提交**：`feat: define QR input validation and renderer boundary`

### 任务 2.4：二维码页面与保存流程

**新增/修改**

- `src/features/qrcode/pages/index.tsx`
- `src/shared/platform/photo-album.ts`
- 对应测试

**步骤**

1. 测试空态、输入、超限、复制和保存按钮状态。
2. 实现 Canvas 展示及 1024×1024 导出。
3. 处理首次授权、拒绝、永久拒绝后前往设置、保存失败。
4. 真机执行 P0 样本矩阵并登记结果。

**建议提交**：`feat: add QR generation and safe photo export`

---

## 7. P3：待办与私有云数据

### 任务 3.1：待办模型与仓储契约

**新增**

- `src/features/todos/model.ts`
- `src/features/todos/model.test.ts`
- `src/features/todos/repository.ts`
- `src/features/todos/local-snapshot.ts`

**测试先行用例**

- 标题 trim、空值拒绝、120 字限制。
- 客户端 id 在重试间保持不变。
- 待办/已完成分组和稳定排序。
- schema v1 快照读写，损坏数据回退。
- 云失败时快照不被错误结果覆盖。

**建议提交**：`feat: define todo model and local snapshot`

### 任务 3.2：云仓储和权限配置

**新增/修改**

- `src/features/todos/cloud-repository.ts`
- `cloud/` 下按 ADR 确定的集合/权限部署配置或 runbook
- `docs/runbooks/cloud-setup.md`

**步骤**

1. 用 fake adapter 写 repository 集成测试：CRUD、超时、权限拒绝、重复 id。
2. 实现真实云适配。
3. 部署 `todos` 集合和仅创建者规则。
4. 两个身份重复 P0 越权测试，并保留结果。
5. 明确时间字段由客户端还是服务端生成并保持一致。

**建议提交**：`feat: persist private todos with enforced ownership`

### 任务 3.3：待办页面

**新增/修改**

- `src/features/todos/pages/index.tsx`
- 页面组件、样式与测试

**测试先行场景**

- 先显示快照并标记同步中。
- 云端成功后校正列表并更新快照。
- 新增防连点。
- 完成/撤销、编辑、删除和 5 秒撤销。
- 离线显示快照，写操作明确失败且可重试。
- 权限错误与普通网络错误使用不同提示。

**建议提交**：`feat: add snapshot-first todo workflow`

---

## 8. P4：阅读内容域或替代工具

### 分支 A：阅读数据源通过 P0

#### 任务 4A.1：同步函数的解析与幂等测试

**新增**

- `cloudfunctions/syncReading/index.ts`
- `cloudfunctions/syncReading/parser.ts`
- 对应 fixture 与测试

**测试先行用例**

- 解析正常、缺字段和异常条目。
- `sourceId + externalId` 产生稳定 id。
- 两次同步不会重复。
- 来源超时不删除旧缓存。
- URL 协议白名单与内容清洗。
- 日志不包含完整正文。

**建议提交**：`feat: add idempotent reading source synchronization`

#### 任务 4A.2：定时任务、集合规则与运维说明

**新增/修改**

- `articles`、`favorites` 权限配置
- `docs/runbooks/reading-sync.md`

验证客户端不能写 articles、用户只能读写自己的 favorites、同步失败保留旧数据、管理端可以手动安全重跑。

**建议提交**：`ops: configure reading sync and data permissions`

#### 任务 4A.3：阅读 repository 与页面

**新增/修改**

- `src/features/reading/model.ts`
- `src/features/reading/repository.ts`
- `src/features/reading/pages/list.tsx`
- `src/features/reading/pages/detail.tsx`
- 对应测试

测试列表分页、旧缓存更新时间、详情清洗内容、收藏幂等、取消收藏和“已收藏”筛选。外链只允许 ADR 认可的协议与域名策略。

**建议提交**：`feat: add reading list detail and favorites`

### 分支 B：阅读数据源未通过 P0

#### 任务 4B.1：更新产品清单

将 registry 中 `reading` 替换为 `scratchpad`，更新设计 ADR 与验收任务，不保留不可用的阅读入口。

#### 任务 4B.2：实现文本暂存

支持本地新增、编辑、复制、删除与 schema 迁移；不自动读取剪贴板，不上传内容。测试 Storage 损坏、复制失败和空文本。

**建议提交**：`feat: add local scratchpad fallback tool`

---

## 9. P5：发布收口

### 任务 5.1：端到端验收表

**新增**：`docs/qa/release-checklist.md`

覆盖：

- 首页至所有工具的点击数和任务用时。
- 番茄钟前台、后台、杀进程、跨日。
- 二维码样本和相册权限状态。
- 待办弱网、断网、重复点击、多身份越权。
- 阅读旧缓存、来源失败、收藏；或暂存工具的本地恢复。
- iOS、Android、开发者工具的设备与版本记录。

### 任务 5.2：性能与包体

1. 记录生产主包、分包和主要依赖体积。
2. 首页不 import 工具页面组件。
3. 检查首屏无不必要云请求和大图。
4. 达到平台限制前主动分包；不为“也许会增长”提前做复杂拆包。

### 任务 5.3：隐私与发布配置

1. 核对实际收集字段与隐私说明一致。
2. 确认不记录二维码文本、待办标题、正文或身份标识。
3. 区分开发、体验、生产环境 ID。
4. 关闭 debug、测试入口与详细 SDK 错误。
5. 检查相册权限用途说明。

### 任务 5.4：部署与回滚 runbook

**新增**

- `docs/runbooks/deploy.md`
- `docs/runbooks/rollback.md`

写明前端构建上传、集合/权限部署、云函数发布、定时任务、体验版验证、正式发布和回滚顺序。保留上一可用前端版本与云函数版本；数据库只做向后兼容迁移。

### 任务 5.5：最终检查

依次执行：

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm build:weapp
git diff --check
git status --short
```

完成全部人工验收，关闭 P0/P1 缺陷，记录仍接受的 P2 风险。

**建议提交**：`release: prepare v0.1 experience build`

---

## 10. 推荐执行批次

每个批次结束都应展示可验证结果，再进入下一批：

1. **批次 1：P0** — 四项 spike 与 ADR；这里允许推翻技术选择。
2. **批次 2：P1** — 正式脚手架、registry、生成器、首页和基础设施。
3. **批次 3：P2** — 两个纯本地工具，先验证生命周期和平台能力。
4. **批次 4：P3** — 待办与私有云权限。
5. **批次 5：P4** — 阅读或已确定的替代工具。
6. **批次 6：P5** — 真机、隐私、部署和体验版。

批次之间不并行跨越依赖。例如 P0 没决定框架前不创建正式脚手架；云权限未通过前不开发待办页面；内容源未通过前不开发阅读 UI。

## 11. 暂不进入本计划的事项

- 工具排序和开关。
- 完整离线写入与冲突合并。
- 番茄历史统计和系统级通知。
- 手动添加任意 URL、全文抓取或 AI 摘要。
- 多端构建、自建后端、管理后台。
- 运行时插件、第三方工具市场。

这些事项只有在 v0.1 数据表明确显示需求后，才进入下一份设计文档。
