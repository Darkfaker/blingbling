# 微信工具集合小程序 — 设计文档

| 字段 | 值 |
|---|---|
| **项目代号** | bbl（工作代号，发布前可改名） |
| **目标平台** | 微信小程序 |
| **文档日期** | 2026-07-02 |
| **作者** | 通过头脑风暴流程产出 |
| **范围** | v0.1 MVP |

---

## 1. 目标与背景

### 1.1 一句话定义
一个**可扩展的微信小程序工具集合**：提供基础内容资讯和若干日常小工具，并以"插件化"方式让新工具的添加成本保持极低。

### 1.2 目标用户
- **主用户**：开发者本人（"我"）
- **次要用户**：少量熟人（家人/朋友/同事），规模 **几十到几百人**
- **不面向**：公众运营、搜索引擎流量、商业变现

### 1.3 成功标准（v0.1）
- [ ] 主用户可在 30 秒内到达任意一个工具
- [ ] 添加一个新工具（含 UI + 数据）的开发时间 ≤ 1 个工作日
- [ ] 5 个 MVP 工具全部可用、稳定，无明显崩溃
- [ ] CloudBase 免费额度内可承载（< 100 用户、单日 < 1000 次云函数调用）

### 1.4 明确不做（v0.1）
- ❌ 工具的"启用/禁用/排序"用户个性化
- ❌ 主题切换 / 深色模式
- ❌ 数据导入导出
- ❌ 订阅消息推送
- ❌ 多用户协作/分享
- ❌ 自建后端（仅预留接口）
- ❌ 多端发布（仅微信小程序）

---

## 2. 技术栈与架构

### 2.1 技术选型

| 维度 | 选型 | 理由 |
|---|---|---|
| 前端框架 | Taro 3 | 多端潜力 + React 生态 + TS 友好 |
| UI 库 | Taro 3 内建 + Taro UI | 与 Taro 3 兼容，按需引入 |
| 语言 | TypeScript | 类型安全、长期可维护 |
| 状态管理 | React Hooks (useState/useReducer/useContext) | MVP 阶段无需 Redux |
| 主后端 | 微信云开发 (CloudBase) | 免运维，自带 Auth/DB/云函数，免费额度够用 |
| 备用后端 | 自建 Node + 关系型 DB（预留接入点） | 后期复杂业务可平滑迁移 |
| 包管理 | pnpm | 速度快、占用小 |
| 代码规范 | ESLint + Prettier | 业界标准 |

### 2.2 架构总览

```
┌─────────────────────────────────────────────────────────────┐
│  小程序前端 (Taro 3 + React 18 + TS)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  框架层: 路由 / 状态 / 组件库 (Taro UI)               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  模块层: src/modules/* (5 个工具 + 首页)               │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  服务层: services/                                     │ │
│  │    ├─ cloudbase.ts    (云开发 SDK 封装)                │ │
│  │    ├─ externalApi.ts  (预留：未来自建后端调用)          │ │
│  │    └─ notify.ts       (通知/震动/Toast 封装)           │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  Hooks: useUser / useCloudCollection / useRemoteData   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────┬──────────────────────────┬───────────────┘
                  │                          │
        ┌─────────▼────────┐       ┌─────────▼─────────┐
        │ 微信云开发(主)   │       │ 自建后端(预留)     │
        │ ├─ Auth          │       │ Node + Express    │
        │ ├─ Database      │       │ + PostgreSQL      │
        │ ├─ Cloud Func    │       │ (后期按需接入)     │
        │ └─ Storage       │       │                    │
        └──────────────────┘       └────────────────────┘
```

### 2.3 关键设计原则

1. **服务层抽象**：所有"外部调用"都走 `services/` 下的接口，未来切换到自建后端**只改一个文件**。
2. **Hooks 统一数据访问**：`useCloudCollection` / `useRemoteData` 屏蔽云开发与外部 API 的差异，模块层只关心"我要什么数据"。
3. **本地状态优先**：能用 `useState/useReducer` 解决的（如番茄钟）绝不上云。
4. **模块零耦合**：模块之间不允许直接 import 对方代码，只能通过"首页导航"或"服务层"间接交互。

---

## 3. 插件化模块系统

### 3.1 模块接口契约

每个工具是一个独立文件夹，**统一导出**这个契约：

```typescript
// src/modules/_contract.ts
export interface ToolModule {
  meta: {
    id: string;            // 'pomodoro' / 'todos' / ...
    name: string;          // 显示名
    icon: string;          // emoji 或 iconfont 名称
    description: string;   // 一句话简介
    category: 'productivity' | 'content' | 'utility' | 'personal';
    requiresAuth: boolean; // 是否必须登录
  };
  routes: Array<{          // 子页面路由
    path: string;          // 'pages/modules/pomodoro/index'
    component: React.ComponentType;
  }>;
  homeEntry?: React.ComponentType; // 首页"快速入口"组件（可选）
}
```

### 3.2 注册中心

```typescript
// src/modules/index.ts
import { articles } from './articles';
import { pomodoro } from './pomodoro';
import { todos } from './todos';
import { qrcode } from './qrcode';
import { favorites } from './favorites';

export const modules: ToolModule[] = [articles, pomodoro, todos, qrcode, favorites];

// 按 category 分组，供首页网格使用
export const modulesByCategory = modules.reduce((acc, m) => {
  (acc[m.meta.category] ??= []).push(m);
  return acc;
}, {} as Record<string, ToolModule[]>);
```

### 3.3 路由动态生成

`app.config.ts` 在启动时把 `modules[].routes` 注入 Taro 的 `pages` 列表——**加新工具不用改路由配置**。

### 3.4 添加新工具的标准流程（3 步）

1. `src/modules/<name>/` 建文件夹，写 `index.ts` 导出 `ToolModule`。
2. 在 `src/modules/index.ts` 的数组里加一行。
3. 完成。

> **承诺**：新工具（含 UI + 数据）的开发时间 ≤ 1 个工作日。

---

## 4. 数据层设计

### 4.1 微信云开发（CloudBase）集合

| 集合 | 用途 | 关键字段 | 安全规则 |
|---|---|---|---|
| `users` | 用户基础信息 | `_openid`, `nickName`, `avatarUrl`, `createdAt` | 只能读/写自己的 `_openid` |
| `todos` | 待办事项 | `_openid`, `title`, `done`, `createdAt`, `dueAt?` | 只能 CRUD 自己的 |
| `favorites` | 收藏条目 | `_openid`, `itemType`, `itemId`, `payload`, `createdAt` | 只能 CRUD 自己的 |
| `articles` | 资讯缓存 | `slug`, `title`, `summary`, `content`, `source`, `fetchedAt` | 所有人可读，仅云函数可写 |

### 4.2 云函数清单

| 函数名 | 触发方式 | 用途 |
|---|---|---|
| `login` | 首次进入 | `wx.login` → 返回/创建 user 文档 |
| `fetchArticles` | 资讯页加载 | 调用外部 RSS/JSON 源，写入 `articles` 集合缓存 |
| `quickstartFunctions` | 部署验证 | 脚手架联通性测试 |

### 4.3 Hooks 层

```typescript
// src/hooks/useUser.ts          // { user, loading, login }
// src/hooks/useCloudCollection.ts // 封装云开发 collection 查询
// src/hooks/useRemoteData.ts     // 统一"云函数取数据"+"loading"+"error"
```

### 4.4 自建后端接入点（预留）

```typescript
// src/services/externalApi.ts —— 现在是 stub，未来替换为真实 fetch
export const externalApi = {
  getWeather: async (city: string) => Promise<WeatherData>,
  summarizeArticle: async (url: string) => Promise<string>,
  // ... 未来加
};
```

模块代码**只调 `externalApi.xxx`**，不直接 import 任何后端 SDK。

---

## 5. 五个工具的详细规格

### 5.1 ① 资讯（articles）

| 项 | 规格 |
|---|---|
| **路径** | `src/modules/articles/` |
| **页面** | 列表页 + 详情页 |
| **数据来源** | 远端 RSS/JSON（通过 `fetchArticles` 云函数代理） |
| **缓存** | 拉取后写入 `articles` 集合（按 `slug` 去重） |
| **登录要求** | 列表/详情不要求；收藏时要求 |
| **关键交互** | 下拉刷新、上拉分页、点击收藏、跳详情 |
| **状态** | local: 滚动位置；remote: 文章列表 + 收藏状态 |

### 5.2 ② 番茄钟（pomodoro）

| 项 | 规格 |
|---|---|
| **路径** | `src/modules/pomodoro/` |
| **页面** | 单页（计时器 + 设置） |
| **状态机** | `idle → focus → break → idle`（`useReducer`） |
| **默认时长** | 专注 25 min / 休息 5 min（可在 UI 调整） |
| **后台保持** | `setInterval` + `wx.setStorageSync` 持久化剩余秒数 |
| **通知** | 切换时 `wx.vibrateLong` + `wx.showToast` |
| **登录要求** | 不要求 |
| **后端** | 无（纯前端状态） |

### 5.3 ③ 待办清单（todos）

| 项 | 规格 |
|---|---|
| **路径** | `src/modules/todos/` |
| **页面** | 列表页（待办/已完成两段） |
| **数据** | `useCloudCollection('todos', where: {_openid: $user}, orderBy: createdAt desc)` |
| **操作** | 点击行=标记完成/取消；左滑=删除；底部 + 按钮新增 |
| **登录要求** | 必须登录 |
| **离线缓存** | 本地 `wx.setStorage` 镜像，弱网时先显示本地 |
| **优化项** | 编辑/截止日期（v0.2 考虑） |

### 5.4 ④ 二维码生成（qrcode）

| 项 | 规格 |
|---|---|
| **路径** | `src/modules/qrcode/` |
| **页面** | 单页（输入框 + 实时二维码） |
| **输入** | 多行文本（支持 URL / 纯文本 / WiFi 字符串） |
| **渲染** | `weapp-qrcode` 库（约 20KB） |
| **操作** | "保存到相册"（`wx.saveImageToPhotosAlbum`）+ "复制文本" |
| **登录要求** | 不要求 |
| **后端** | 无 |

### 5.5 ⑤ 收藏夹（favorites）

| 项 | 规格 |
|---|---|
| **路径** | `src/modules/favorites/` |
| **页面** | 列表页 |
| **数据** | `useCloudCollection('favorites', where: {_openid: $user})` |
| **来源** | v0.1 仅"从资讯页收藏"；v0.2 扩展到任意 URL/手动添加 |
| **操作** | 点击=跳原文/详情；长按=取消收藏 |
| **登录要求** | 必须登录 |
| **排序** | 收藏时间倒序 |

---

## 6. 项目结构

```
bbl/
├── src/
│   ├── app.tsx                       # 应用入口
│   ├── app.config.ts                 # 路由配置（自动注入模块路由）
│   ├── modules/
│   │   ├── _contract.ts              # ToolModule 接口
│   │   ├── index.ts                  # 注册中心
│   │   ├── home/                     # 首页（工具网格）
│   │   ├── articles/                 # ① 资讯
│   │   ├── pomodoro/                 # ② 番茄钟
│   │   ├── todos/                    # ③ 待办
│   │   ├── qrcode/                   # ④ 二维码
│   │   └── favorites/                # ⑤ 收藏
│   ├── components/                   # 通用组件（Card, Empty, Loading, ...）
│   ├── hooks/                        # useUser / useCloudCollection / useRemoteData
│   ├── services/
│   │   ├── cloudbase.ts
│   │   ├── externalApi.ts
│   │   └── notify.ts
│   ├── types/                        # 全局类型
│   └── utils/
├── cloudfunctions/                   # 微信云开发云函数
│   ├── login/
│   ├── fetchArticles/
│   └── quickstartFunctions/
├── project.config.json               # 微信开发者工具配置
├── tsconfig.json
├── package.json
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-07-02-wechat-toolbox-design.md
```

---

## 7. 实施阶段

| 阶段 | 任务 | 工期 | 验收标准 |
|---|---|---|---|
| **P0 脚手架** | Taro 初始化、TS 配置、CloudBase 开通、目录结构、基础路由 | 1 天 | `npm run dev:weapp` 能跑出空首页 |
| **P1 插件化框架** | `ToolModule` 契约、注册中心、首页网格、动态路由注入 | 1.5 天 | 写一个空模块能在首页看到并能点进去 |
| **P2 鉴权** | `wx.login` 流程、`useUser`、需登录页面的路由守卫 | 0.5 天 | 未登录访问 todos 跳登录页 |
| **P3 工具开发** | 按 ④ → ② → ③ → ① → ⑤ 顺序（由易到难） | 每工具 0.5~1 天，共 ~4 天 | 5 个工具全部跑通核心流程 |
| **P4 打磨** | 空状态/loading/错误处理/简单动效 | 1 天 | 弱网/空数据/异常场景都有合理 UI |
| **总计** | | **~8 个工作日** | |

### 7.1 实施顺序的理由

按"技术风险由低到高"排列：

1. **④ 二维码**：纯前端 + 简单库，验证"工具嵌入 + UI 布局"基础。
2. **② 番茄钟**：纯前端 + 状态机，验证"复杂本地状态"模式。
3. **③ 待办**：第一个云数据库 CRUD，验证"登录 + 云 DB"全链路。
4. **① 资讯**：第一个云函数 + 远端拉取，验证"代理模式 + 缓存"。
5. **⑤ 收藏夹**：依赖 ① + ③，验证"跨模块数据交互"。

---

## 8. 风险与缓解

| 风险 | 影响 | 缓解措施 |
|---|---|---|
| Taro 3 + Taro UI 版本不兼容 | 脚手架卡住 | 用 Taro 官方推荐的 `taro init` 模板初始化，固定版本 |
| CloudBase 配额超限 | 后续用户增长后崩溃 | v0.1 内不担心；预留监控（云函数日志） |
| 资讯源 RSS 不稳定 | 资讯页加载失败 | 云函数内做 try/catch + 失败时返回上次缓存 |
| 微信开发者工具调试体验差 | 开发效率低 | 使用 Taro 的 H5 模式做主开发，发布前用微信工具验证 |
| 二维码库体积大 | 包体积膨胀 | 使用 `weapp-qrcode`（约 20KB），避免引入完整 qrcode 库 |

---

## 9. 后续迭代方向（v0.2+ 备选）

- 工具的启用/禁用/排序（用户个性化）
- 深色模式
- 数据导入/导出（JSON 备份）
- 订阅消息推送（番茄钟完成提醒）
- 多端发布（H5、支付宝小程序、抖音小程序）
- 自建后端（替换 CloudBase 的部分功能）
- 工具市场（用户可"安装"第三方工具）
- PWA / 离线优先

---

## 附录 A：决策记录

| # | 决策 | 选项 | 选择 | 理由 |
|---|---|---|---|---|
| 1 | 目标平台 | 微信/支付宝/抖音/通用 | **微信** | 生态最大、文档最全 |
| 2 | 使用范围 | 个人/小范围/公开 | **小范围** | 需登录但不需运营后台 |
| 3 | 技术背景 | 零基础/有基础/小程序经验/全栈 | **全栈** | 具备后端选型能力 |
| 4 | 后端架构 | CloudBase/自建/BaaS/混合 | **混合（CloudBase 主 + 预留自建）** | 快速出活 + 留扩展空间 |
| 5 | MVP 范围 | 极简3/标准5/内容3/工具3 | **标准5** | 三种数据形态全覆盖 |
| 6 | 技术栈 | 原生JS / Taro+React+TS / uni-app+Vue+TS | **Taro 3 + React + TS** | 多端潜力 + 长期工程化 |
