# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

货代操作运营系统 — 通过中国铁路 95306 平台（ec.95306.cn）查询铁路货运箱号、追踪全程轨迹的 Web 应用。

## 常用命令

```bash
npm run dev          # 并行启动：Express API (3001端口) + Vite dev server (5173端口)
npm run build        # 构建 server + client 到 dist/
npm run start        # 生产模式启动（需要先 build）
npm run db:init      # 初始化/运行数据库迁移
```

## 技术栈

- **前端**: React 19 + TypeScript + Vite 6 + Zustand 5 + React Router 7（纯 CSS，无 UI 框架）
- **后端**: Express 5 + better-sqlite3 + Zod 3（请求校验）+ Axios（调用 95306 API）
- **数据库**: SQLite（`server/data/cargo-tracker.db`），WAL 模式，由后端直接操作，无 ORM

## 架构

```
浏览器 (5173) → Vite proxy → Express API (3001) → SQLite / 95306 外部 API
```

### 后端分层 (server/src/)

| 层 | 文件 | 职责 |
|---|---|---|
| 入口 | `index.ts` | 初始化 DB → 执行迁移 → 启动服务 |
| Express 工厂 | `app.ts` | CORS 配置、JSON 解析、生产模式托管静态文件、挂载路由 |
| 路由 | `routes/*.ts` | Zod 校验请求体 → 调用 service → 返回 JSON |
| 服务 | `services/*.ts` | 核心业务逻辑：调用 95306 API、缓存、存储 |
| 数据库 | `database/connection.ts` | SQLite 单例，`initDb()` 创建、`getDb()` 获取 |
| 迁移 | `database/migrations.ts` | 建表（无版本迁移，直接 CREATE TABLE IF NOT EXISTS） |
| 工具 | `utils/retry.ts` | 指数退避重试（默认 2 次，仅对 5xx/429 重试） |
| 工具 | `utils/ydidEncoder.ts` | ydid 进行 6 次 Base64 编码后传给轨迹 API |

### API 路由

- `POST /api/auth/credentials` — 保存浏览器 Cookie（自动解析 accessToken + userdo），存入 `auth_credentials`
- `GET /api/auth/status` — 查询当前认证状态
- `POST /api/cargo/track` — 按箱号查询发货(type=1)和收货(type=2)运单，结果写入 `search_queries`
- `GET /api/cargo/trajectory/:ydid` — 按运单号查全程轨迹，24h SQLite 缓存（`trajectory_cache` 表）
- `GET /api/cargo/history` — 分页查询历史，支持 `boxNumber` 模糊搜索
- `DELETE /api/cargo/history/:id` — 删除单条历史
- `GET/POST /api/box-numbers` — 箱号列表 / 添加
- `PUT/DELETE /api/box-numbers/:id` — 更新 / 软删除箱号
- `POST /api/box-numbers/:id/refresh` — 刷新单个箱号最新状态
- `POST /api/box-numbers/refresh-all` — 批量刷新所有活跃箱号

### 95306 认证流程

`api95306.ts` 创建 Axios 实例时通过请求拦截器从 `auth_credentials` 表注入 `access_token`、`userid`、`username` 等 Header。响应 401 时自动失效凭证。用户需在浏览器登录 95306 后复制 Cookie，通过 `/credentials` 页面提交，后端解析 `95306-1.6.10-accessToken` 和 `95306-1.6.10-userdo`。

### 前端路由 & 状态

- `/` — TrackSearchPage：箱号输入 → 搜索 → 发货/收货双标签列表
- `/trajectory/:ydid` — TrajectoryPage：轨迹时间线 + 经停站列表
- `/history` — HistoryPage：查询历史（分页 + 箱号筛选）
- `/box-numbers` — BoxNumberManagePage：箱号清单 CRUD + 批量刷新
- `/credentials` — CredentialsPage：95306 Cookie 配置

全局状态：`authStore`（认证状态）、`searchStore`（当前搜索状态）。Zustand stores 直接调用 `api/client.ts` 的 fetch 封装，不经过额外的中间层。

### 数据表

- `auth_credentials` — 95306 认证令牌（is_active=1 为当前生效）
- `search_queries` — 查询历史记录
- `trajectory_cache` — 轨迹缓存（24h 过期，按 ydid 唯一）
- `tracked_box_numbers` — 关注的箱号列表（软删除 is_active=0）

## 关键约定

- 前端 `.js` 扩展名在 import 中显式写出（如 `'./Layout.js'`），配合 `moduleResolution: "bundler"`
- `Promise.allSettled` 用于并行请求发货/收货两个方向的 95306 API，单侧失败不影响另一侧
- 箱号操作均为软删除（`is_active = 0`），不物理删除
