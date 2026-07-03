# bbl 日漫风 UI 重设计 实施计划

> 对应设计：[2026-07-03-anime-ui-redesign.md](../specs/2026-07-03-anime-ui-redesign.md)
>
> 父计划：[2026-07-03-wechat-toolbox-implementation-plan.md](./2026-07-03-wechat-toolbox-implementation-plan.md)
>
> 本计划只动**视觉层**。领域逻辑、状态机、仓储、路由、CI、测试保持不动。

## 1. 交付目标

把 5 个页面（首页 / 设置 / 待办 / 番茄钟 / 二维码 / 阅读）的视觉层从"国内小程序治愈系"重做为一以贯之的"新海诚色 + 手绘 SVG 贴纸 + 玻璃拟态"日漫风。

完成定义：

- `pnpm check` 一次通过：typecheck + lint + test + manifest 校验 + weapp build。
- 5 个页面渲染稳定（微信开发者工具模拟器无白屏、无溢出）。
- 主页包体积增量 ≤ 50KB（gzip 前）。
- 现有 27 个单元测试仍全绿。
- 视觉资产 100% 本地 SVG，不引入新 npm 依赖。

## 2. 工作原则

1. 每个 commit 只动一个页面或一组视觉资产，便于回滚。
2. 重写样式不破坏 SCSS 变量契约；旧变量若不再使用，从 `app.scss` 删除（不要留"以备后用"的死变量）。
3. SVG 资产按"先四个工具图标 → 装饰元素 → 主页角色"顺序产出，前面的稳定后再产出后面的。
4. 每个视觉资产单独文件，不内联到 tsx，便于以后替换。
5. 不破坏现有组件测试和 manifest 校验；emoji 字符从 `ToolManifest.icon` 移除时同时更新 `registry.test.ts` 期望值（如有）。

## 3. 开工输入（已就绪）

- 父设计 / 父计划（specs/plans/2026-07-02/03）
- 当前 6 个 .tsx + 6 个 .scss 源文件路径
- Taro 4.2 编译目标 weapp

不需要 P0 验证：本次只重做视觉，不引入新平台能力、不改 manifest、不动云函数。

## 4. 任务清单

### 任务 1：建立视觉资产目录与注册表

**新增**

- `src/assets/icons/icon-todos.svg`
- `src/assets/icons/icon-pomodoro.svg`
- `src/assets/icons/icon-qrcode.svg`
- `src/assets/icons/icon-reading.svg`
- `src/assets/icons/icon-feather.svg`
- `src/assets/icons/icon-tomato.svg`
- `src/assets/icons/icon-link.svg`
- `src/assets/icons/icon-book.svg`
- `src/assets/icons/icon-moon.svg`
- `src/assets/decor/avatar.svg`
- `src/assets/decor/sakura-petal.svg`
- `src/assets/decor/paper-plane.svg`
- `src/assets/decor/distant-mountains.svg`
- `src/assets/decor/cloud.svg`
- `src/assets/decor/horizon.svg`
- `src/assets/registry.ts`（图标 key → 资源路径映射）

**步骤**

1. 按 [设计文档 §5.2](../specs/2026-07-03-anime-ui-redesign.md#52-svg-风格规范) 风格规范手写每个 SVG。
2. 每个 SVG 含 `viewBox`，单文件 ≤ 4KB。
3. 注册表用 TS 字面量，禁止 `as any`。

**完成标准**：5 个目录都存在，注册表 key 全部能解析到文件。

**建议提交**：`assets: add shinkai-style svg icons and decor`

### 任务 2：重写全局 token（app.scss + app.config.ts）

**修改**

- `src/app.scss`
- `src/app.config.ts`

**步骤**

1. 删除旧 `--primary/--bg/--surface/--text/--line/--shadow` 等已不用的 token。
2. 新增 spec §2.1 全部色 token、§4 圆角 / 描边 / 阴影 / 玻璃态。
3. `.page` 默认背景换为日间黄昏渐变（`--bg-sky`）。
4. `.section-title` 改为 8×24rpx 主色贴纸 + 1rpx 描边（spec §3.3）。
5. `.card` 加 1rpx 描边。
6. `.primary-button` / `.secondary-button` / `.danger-button` 重写。
7. `app.config.ts` 顶部 nav 用 `rgba(255, 246, 240, 0.72)`。

**完成标准**：app.scss 文件净增/改不超过 200 行；所有变量都有注释指向 spec 节号。

**建议提交**：`style: refresh global tokens to shinkai palette`

### 任务 3：更新工具注册表（去掉 emoji）

**修改**

- `src/features/registry.ts`
- `src/features/registry.test.ts`

**步骤**

1. `ToolManifest.icon` 类型保持 `string`，但值改为 SVG 文件名（如 `'icon-todos'`）。
2. `tools` 数组里 emoji 全部替换为文件名。
3. 跑 `pnpm test`，确认 registry 校验仍通过（`validateTools` 不依赖 icon 内容）。
4. 如有测试断言 icon 字符串，更新期望。

**完成标准**：测试全绿；`grep -r "🌸\|🍅\|✨\|📖" src/` 为空。

**建议提交**：`feat(registry): replace emoji with svg icon keys`

### 任务 4：重写首页

**修改**

- `src/pages/home/index.tsx`
- `src/pages/home/index.scss`
- `src/pages/home/index.config.ts`

**步骤**

1. hero 区域：天空渐变背景 + 远山 SVG + 角色 SVG 头像 + 飘动樱花瓣 ×2。
2. "继续使用"卡片用 hero 同色系渐变，左侧大 SVG。
3. 工具网格：每张卡片用 `<Image src={iconPathFor(tool.id)} />` 替代 `<Text>{tool.icon}</Text>`。
4. 时段色温：根据 `new Date().getHours()` 在 hero 上加 `data-phase` 属性，CSS 用 `[data-phase="dusk"]` 切换调色。
5. 页脚用 SVG 月亮图标替代 emoji。

**完成标准**：首页在开发者工具渲染正常；hero 高度 ≥ 360rpx；飘动动画 6s 循环。

**建议提交**：`feat(home): rebuild hero with shinkai sky and svg decor`

### 任务 5：重写待办页

**修改**

- `src/features/todos/pages/index.tsx`
- `src/features/todos/pages/index.scss`

**步骤**

1. 顶部手绘"清单"小标题（带羽毛笔 SVG）。
2. 输入框：玻璃感 + 聚焦时 4rpx 主色 halo。
3. 列表 checkbox 用 1.5rpx 描边圆，完成态主题色填充。
4. 空状态：手绘"晨光中的空清单"插画 + 文案。
5. 状态机、validate、setItems 等**全部保持不变**。

**完成标准**：交互行为与父计划 P3 一致；视觉为日漫风。

**建议提交**：`style(todos): apply shinkai visual language`

### 任务 6：重写番茄钟页

**修改**

- `src/features/pomodoro/pages/index.tsx`
- `src/features/pomodoro/pages/index.scss`

**步骤**

1. 状态 pill：主题色贴纸（focus = 暖橘 / break = 薄荷青）。
2. 圆环：8rpx 描边 + 淡色"远山"线稿背景 + 中央 200rpx 数字。
3. 数字每秒 0.05em 垂直位移"呼吸"。
4. 阶段切换时樱花瓣 / 嫩叶装饰元素显隐。
5. 按钮：日漫风"对话框气泡"形，主按钮带 1rpx 描边。
6. 状态机、useEffect、remainingMs 等**全部保持不变**。

**完成标准**：计时和恢复行为不变；视觉聚焦在圆环。

**建议提交**：`style(pomodoro): rebuild ring and buttons in shinkai style`

### 任务 7：重写二维码页

**修改**

- `src/features/qrcode/pages/index.tsx`
- `src/features/qrcode/pages/index.scss`

**步骤**

1. 输入卡片：手写感 placeholder，玻璃质感。
2. QR 容器：白底圆角 32rpx + 1rpx 描边 + 薄荷青 4rpx 外光晕。
3. 字节数 pill：主题色贴纸。
4. 复制 / 保存相册按钮：主色渐变 + 1rpx 高光描边。
5. QR 编码逻辑、Canvas 渲染、字节限制**全部保持不变**。

**完成标准**：1024×1024 导出仍正常工作。

**建议提交**：`style(qrcode): apply shinkai visual language`

### 任务 8：重写阅读列表 / 详情

**修改**

- `src/features/reading/pages/list.tsx`
- `src/features/reading/pages/detail.tsx`
- `src/features/reading/pages/reading.scss`
- `src/features/reading/pages/list.config.ts`
- `src/features/reading/pages/detail.config.ts`

**步骤**

1. 列表页 chips 改为主题色描边贴纸。
2. 文章卡：左侧 4rpx 主色"书签"条 + 标题 + 摘要。
3. 详情页 hero：黄昏远山渐变条 + 大号标题。
4. 收藏按钮：手绘"小星星"贴纸。
5. repository 同步逻辑、article 模型、5 状态机**全部保持不变**。

**完成标准**：列表 / 详情 / 收藏 / 同步行为不变。

**建议提交**：`style(reading): rebuild list and detail in shinkai style`

### 任务 9：重写设置页

**修改**

- `src/pages/settings/index.tsx`
- `src/pages/settings/index.scss`
- `src/pages/settings/index.config.ts`

**步骤**

1. hero：手绘"小屋"图标 + 标题。
2. 数据与隐私：每行 4rpx 主色竖条 + 文案。
3. 清理按钮：危险色贴纸 + 1rpx 描边。
4. 版本卡：底部加一条手绘"地平线"线稿。

**完成标准**：设置页视觉与其他页面统一；清缓存逻辑保持。

**建议提交**：`style(settings): apply shinkai visual language`

### 任务 10：最终验证

**步骤**

1. `pnpm check` 一次跑完。
2. `pnpm dev:weapp` 起开发服务器，用微信开发者工具模拟器打开 5 个页面，截图比对 spec §6。
3. `du -sh dist/` 对比旧包大小，确认增量 ≤ 50KB。
4. `git diff --check` 通过。
5. 写一个简短的 `docs/qa/anime-ui-visual-check.md` 记录截图与对比结论。

**完成标准**：上面 4 项全过。

**建议提交**：`docs: record anime ui visual verification`

---

## 5. 风险与降级

| 风险 | 概率/影响 | 预防 | 降级 |
|---|---|---|---|
| SVG 在某些微信基础库渲染异常 | 中/中 | 用标准 SVG 1.1 子集；不用 filter / foreignObject | 降级为 PNG 备用 |
| 玻璃模糊在低端机卡顿 | 中/低 | `backdrop-filter` 仅 hero / 顶部 nav 用 | 降级为半透明实色 |
| 包体超 50KB | 低/低 | 任务 1 每个 SVG ≤ 4KB 限制 | 移除非关键装饰 |
| 用户已绑定旧 design doc 习惯 | 低/低 | 父设计 v2 的 1.4 验收标准保持 | 通过 git revert 单页回滚 |

## 6. 不做

- 不写新单元测试（视觉层无法低成本单测）
- 不动领域逻辑、状态机、仓储、CI
- 不引入 npm 依赖
- 不做暗色模式（时段色温已提供情绪变化）
- 不做 Lottie / 视频背景
- 不做角色养成系统
