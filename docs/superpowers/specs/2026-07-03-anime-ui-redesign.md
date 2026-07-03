# bbl 日漫风界面重设计 v1

| 字段 | 内容 |
|---|---|
| 文档代号 | anime-ui |
| 父设计 | [2026-07-02-wechat-toolbox-design.md](./2026-07-02-wechat-toolbox-design.md) |
| 平台 | 微信小程序（仍由 Taro 编译，运行时不变） |
| 范围 | 视觉层 + 少量文案与组件结构 |
| 不在范围 | 工具领域逻辑、状态机、仓储、云函数、路由、CI |
| 设计日期 | 2026-07-03 |
| 文档状态 | 可实施规格 |

---

## 0. 背景与目标

父设计已经稳定：v0.1 有首页、设置、待办、番茄钟、二维码、阅读五个页面，组件、状态机、仓储、CI 都已就绪，单元测试 27 个绿。

唯一问题是**视觉层**：现在的实现采用通用"国内小程序治愈系"配方（樱花粉 #FF7B9C + 奶油色 + emoji 装饰 + 圆角 + 阴影），缺乏日漫的辨识度，与"日漫风"的用户期待有明显距离。

本次只重做**视觉层**，领域逻辑、状态机、仓储、路由、测试都不动。功能验收全部沿用父设计 v2 的 1.4 节。

成功标准：

1. 第一眼看上去就是日漫，而不是"通用治愈系小程序"。
2. 全部 5 个页面（首页 + 设置 + 4 工具）统一一套设计语言。
3. `pnpm check` 一次通过（typecheck + lint + test + validate + weapp build）。
4. 视觉资产为内联 SVG 或本地 PNG，不引入新 npm 依赖，不增加云端请求。
5. 微信小程序主包体积增加 ≤ 50KB（gzip 前）。

---

## 1. 美术方向：新海诚 / 唯美清新

### 1.1 选型理由

| 候选 | 选择 | 原因 |
|---|---|---|
| A 新海诚/唯美清新 | ✅ | 现有"治愈系"太甜腻，新海诚色能拉出天空/光/远景的辨识度；和中性功能（待办/计时）冲突小；与"Komorebi 木漏れ日"的应用名一致 |
| B 吉卜力/和风手绘 | ❌ | 毛笔字体在 28rpx 小屏上不可读；留白多会损失信息密度 |
| C 少年漫画/Jump 系 | ❌ | 鲜艳红黄 + 爆炸星号会与"个人工作台"的安静调性冲突 |
| D 极简二次元/浮世绘现代 | ❌ | 与现有色系太近，升级感不足 |

### 1.2 视觉关键词

- **天空、远景、光斑** — 新海诚标志
- **玻璃拟态 + 渐变天空** — 顶部蓝紫到橘，底部奶白
- **手绘细线 + 半透明色块** — 区别于实心卡片
- **大留白 + 大字号** — 标题用 44-56rpx，副标题 24-26rpx
- **小装饰物** — 樱花瓣、纸飞机、远山剪影、电车轨道、云朵
- **黄昏色温切换** — 根据时段在"晨曦/正午/黄昏/夜晚"四套调色间淡入切换

### 1.3 明确不做

- 不引入第三方 UI 库（Vant / Taro UI / NutUI）。
- 不引入字体文件（保持系统字，依赖粗细对比和字间距做日漫感）。
- 不引入 Lottie / 视频背景（包体和性能成本高）。
- 不做全屏插画背景（首屏加载慢，与小屏阅读冲突）。
- 不在生产构建中包含任何 emoji（emoji 渲染跨平台不一致，已被替换为 SVG）。
- 不做"角色养成"型头像/养成系统（与"个人工具"定位不符；只用静态 SVG 角色图）。

---

## 2. 色彩系统

### 2.1 调色板（日间默认 = 黄昏前 18:00）

```text
--sky-1:  #FFD8A8
--sky-2:  #FFB5A7
--sky-3:  #C9A0DC
--sky-4:  #6B8DD6
--sky-5:  #2D3D6B

--surface:        #FFFFFF
--surface-soft:   #FFF6F0
--surface-glass:  rgba(255, 255, 255, 0.62)

--ink:            #1F2347
--ink-soft:       #4A4F7A
--ink-muted:      #8A8FB0
--ink-faint:      #C5C9DE

--line:           rgba(31, 35, 71, 0.08)
--line-strong:    rgba(31, 35, 71, 0.16)

--accent-sun:     #FF8E72
--accent-sakura:  #FF7BA9
--accent-leaf:    #7BC8A4
--accent-mint:    #6FCFD5
--accent-iris:    #9F7BD3

--danger:  #E85D75
--success: #5BB87A
--warning: #E8A53F
```

### 2.2 工具主题色

| 工具 | 主色 | 辅助色 | 语义 |
|---|---|---|---|
| 待办 | `#FF8E72` 暖橘 | `#FFD8A8` | 晨光 / 醒来的清单 |
| 番茄钟 | `#E85D75` 樱粉 | `#FF7BA9` | 专注时的暖意 |
| 二维码 | `#6FCFD5` 薄荷青 | `#7BC8A4` | 清晰 / 链接通道 |
| 阅读 | `#9F7BD3` 鸢尾紫 | `#C9A0DC` | 黄昏 / 远山 |

### 2.3 时段色温

- 早晨 5-11：`sky-2`（桃粉）→ `sky-4`（湖蓝）
- 正午 11-14：浅奶白为主，色块高饱和
- 黄昏 14-18：`sky-1`（暖橘）→ `sky-3`（远山紫）
- 夜晚 18-5：`sky-4`（湖蓝）→ `sky-5`（深夜蓝），文字与卡片降透明度

时段过渡用 `transition: background 1.2s ease` 淡入 6 秒。

---

## 3. 排版

### 3.1 字体

- 保留系统字（`-apple-system, PingFang SC, sans-serif`），不打包字体。
- 标题：`font-weight: 800`，`letter-spacing: 0.04em`，`line-height: 1.2`。
- 正文：`font-weight: 500`，`letter-spacing: 0.02em`，`line-height: 1.6`。
- 时间数字：`font-variant-numeric: tabular-nums`，`font-weight: 700`，大号（番茄钟 200rpx+）。

### 3.2 字号尺度

| 用途 | 字号 |
|---|---|
| 大标题（页面 H1） | 56rpx |
| 中标题（卡片标题） | 36rpx |
| 小标题（章节） | 28rpx |
| 正文 | 28rpx |
| 副文 | 24rpx |
| 注释 | 22rpx |

### 3.3 标题处理

- 大标题用渐变 `linear-gradient(135deg, var(--accent-sun) 0%, var(--accent-sakura) 100%)`，`background-clip: text`。
- 章节小标题用日漫感"小色块"前缀：8rpx × 24rpx 圆角矩形，主题色，**带 1rpx 描边**形成"贴纸"感。

---

## 4. 形状与质感

### 4.1 圆角

- 卡片：32rpx（比原来 28rpx 更大，更"软"）
- 按钮：999rpx（保持 pill 形）
- 图标容器：28rpx
- 工具卡图片角：36rpx

### 4.2 描边

- 所有色块/卡片加 1rpx `rgba(255,255,255,0.4)` 描边
- 输入框聚焦时 4rpx 半透明主色 halo
- 这是日漫的"贴纸"质感关键

### 4.3 阴影

- 极轻：`box-shadow: 0 8rpx 32rpx -8rpx rgba(31, 35, 71, 0.10)`
- 不再用粉色阴影；改用深紫蓝阴影

### 4.4 玻璃拟态

- 顶部 nav 背景：`rgba(255, 246, 240, 0.72)` + `backdrop-filter: blur(20rpx)`
- 浮起卡片：`background: rgba(255, 255, 255, 0.72)` + 模糊

### 4.5 装饰元素

- 主页 hero：右上角 1 个 SVG 角色剪影 + 1 个纸飞机 + 2 朵樱花瓣飘动
- 工具卡：左下角小 SVG 装饰（待办=羽毛笔、番茄=小番茄、QR=链接环、阅读=翻开的书）
- 章节标题：日漫感"小色块 + 描边"
- 设置页：远山 SVG 装饰条横在 hero 下方

---

## 5. 视觉资产

### 5.1 资产清单

| 文件 | 用途 | 形式 |
|---|---|---|
| `assets/avatar.svg` | 主页 hero 角色 | inline SVG |
| `assets/sakura-petal.svg` | 飘动装饰 | inline SVG |
| `assets/paper-plane.svg` | 主页装饰 | inline SVG |
| `assets/distant-mountains.svg` | 主页 hero 底部 | inline SVG |
| `assets/icon-todos.svg` | 待办图标 | inline SVG |
| `assets/icon-pomodoro.svg` | 番茄钟图标 | inline SVG |
| `assets/icon-qrcode.svg` | 二维码图标 | inline SVG |
| `assets/icon-reading.svg` | 阅读图标 | inline SVG |
| `assets/icon-book.svg` | 阅读页装饰 | inline SVG |
| `assets/icon-feather.svg` | 待办页装饰 | inline SVG |
| `assets/icon-link.svg` | 二维码页装饰 | inline SVG |
| `assets/icon-tomato.svg` | 番茄钟页装饰 | inline SVG |

### 5.2 SVG 风格规范

- 线条：2rpx stroke，stroke-linecap/linejoin round
- 填色：渐变 + 2-3 色调，主色 + 高光 + 暗部
- 不用滤镜、不用 shadow filter（性能 + 跨端兼容）
- 所有 SVG 含 `viewBox`，自动适配 1x/2x/3x
- 单文件 ≤ 4KB

### 5.3 不使用 emoji

- 所有 emoji（🌸🍅✨📖）从代码中删除
- `ToolManifest.icon` 字段类型从 `string` 改为 `string`（仍存视觉描述的字符串作为 a11y 标签/降级），但**渲染层完全用 SVG 替换**
- 实际渲染：`<Image src={iconPathFor(tool.id)} />` 替代 `<Text>{tool.icon}</Text>`

---

## 6. 页面级设计

### 6.1 共享

- `app.scss` 重写 token，新加 `--bg-sky` 渐变、玻璃态、贴纸描边
- `section-title` 改为 8×24rpx 主色贴纸 + 1rpx 描边
- `.card` 加 1rpx 白色描边 + 极轻阴影
- `.primary-button` 用主色渐变 + 内部 1rpx 高光描边

### 6.2 首页

- **Hero**（顶 360rpx）：左侧日期 chip + 大标题"今天的天空很美"（渐变文字）+ 副标；右侧圆形角色头像 + 远山剪影；背景天空渐变（黄昏色）；飘动樱花瓣 ×2
- **继续使用**：手绘风"窗口"卡片，左侧大图标 + "回到 · 待办"
- **我的工具箱**：2×2 网格，每张工具卡 = 大 SVG 图标 + 标题 + 描述 + 右下角主题色"小贴纸"标签
- **页脚**：纯文字"v0.1.0"（用 SVG 月亮替代 emoji）

### 6.3 待办

- 顶部：手绘风"清单"小标题 + 输入框（玻璃感 + 描边）
- 列表：每项左侧 1.5rpx 描边圆圈 checkbox（完成态用主题色填充），右侧删除按钮贴纸
- 空状态：手绘风"晨光中的空清单"插画 + "今天还没有待办，开始写第一件吧"

### 6.4 番茄钟

- 顶部：状态 pill（用主题色贴纸）
- 中间：超大圆环（描边 8rpx），中央 200rpx 数字
- 圆环背景是淡淡的"远山"线稿
- 阶段切换：focus 暖橘环 + 樱花瓣飘；break 薄荷青环 + 嫩叶
- 按钮：日漫风"对话框气泡"形，主按钮带描边

### 6.5 二维码

- 顶部：输入卡片（手写风 placeholder）
- 中间：白底圆形 QR 容器，外圈 1rpx 描边 + 薄荷青光晕
- 字节数 pill：主题色贴纸
- 操作按钮：复制（主）、保存相册（次）

### 6.6 阅读

- **列表页**：顶部筛选 chips（主题色描边贴纸）；每篇文章卡 = 左侧 4rpx 主色"书签"条 + 标题 + 摘要
- **详情页**：hero 卡片顶部是"黄昏远山"渐变条 + 标题大号 + 摘要手写感
- 收藏按钮：手绘风"小星星"贴纸

### 6.7 设置

- hero：手绘风"小屋"图标 + "设置与隐私"标题
- 数据与隐私：每行 4rpx 主色竖条 + 文案
- 清理按钮：危险色贴纸
- 版本卡：底部加一条手绘"地平线"线稿

---

## 7. 交互与动效

- 全局：所有 hover/active 用 `transform: translateY(-2rpx) scale(0.98)` 双属性
- Hero 樱花瓣：`@keyframes sakura-fall` 6s 线性循环，translate + rotate
- 番茄钟数字：每秒一次 0.05em 垂直位移"呼吸"
- 时段色温切换：`useDidShow` 时计算本地小时，60 分钟内淡入过渡
- 工具卡点击：先 0.1s 缩放反馈，再 navigateTo

---

## 8. 兼容与约束

- Taro 编译产物的 SCSS 单位（rpx）保持不变
- 内联 SVG 通过 `<Image>` 标签引用本地静态资源
- 不引入 Taro UI、不引入动画库
- 包体目标：gzip 前主包增量 ≤ 50KB

---

## 9. 验收

| 项 | 方法 |
|---|---|
| 视觉统一 | 5 个页面截图（dev:weapp + 微信开发者工具模拟器）人工比对 |
| `pnpm check` | typecheck + lint + test + validate + weapp build |
| 包体增量 | `du -sh dist/` before/after |
| 单元测试 | 不需要新增；现有 27 个必须仍绿 |

---

## 10. 不做

- 不重做领域模型、状态机、仓储
- 不动 CI 脚本、validate 脚本
- 不改路由、manifest 校验
- 不引入 npm 依赖
- 不写新的单元测试
- 不做暗色模式
- 不做动效库
