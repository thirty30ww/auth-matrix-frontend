# Auth Matrix Frontend

> 基于 Vue3 + Element Plus 的企业级权限管理系统前端

[![Vue](https://img.shields.io/badge/Vue-3.5.17-brightgreen)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.10.4-blue)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 核心特性

### 智能权限控制
- **四级权限粒度**: 目录→菜单→页面→按钮的完整权限控制链路
- **动态路由加载**: 基于用户角色实时生成个性化路由和菜单
- **权限指令系统**: `v-permission` 指令实现组件级权限控制

### 现代化UI设计
- **双主题无缝切换**: 明暗主题智能切换，支持系统偏好自动适配
- **响应式布局系统**: Header/Sidebar双布局模式，适配各种屏幕尺寸
- **流畅动画体验**: 页面切换、主题变更、加载状态的精心动画设计

### 开发体验优化
- **TypeScript全覆盖**: 完整类型定义，IDE智能提示和编译时检查
- **Pinia状态管理**: 模块化状态管理，支持持久化和开发工具
- **组件化架构**: 业务组件与基础组件分离，高度可复用

## 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 核心框架 | Vue | 3.5.17 | 渐进式框架 |
| 开发语言 | TypeScript | 5.8.3 | 类型安全 |
| 构建工具 | Vite | 7.0.4 | 快速构建 |
| UI组件库 | Element Plus | 2.10.4 | 组件库 |
| 状态管理 | Pinia | 3.0.3 | 状态管理 |
| 路由管理 | Vue Router | 4.5.1 | 路由系统 |
| HTTP客户端 | Axios | 1.10.0 | 请求库 |
| 工具库 | VueUse | 13.7.0 | 组合式工具集 |
| 图表库 | ECharts | 6.0.0 | 数据可视化 |
| WebSocket | STOMP.js | 7.2.1 | 实时通信 |

## 项目架构

```
frontend/
├── src/
│   ├── assets/          # 静态资源
│   │   ├── icon/        # SVG图标资源
│   │   └── style/       # 模块化样式系统
│   │       ├── animations/  # 动画效果定义
│   │       ├── color/       # 主题色彩方案
│   │       └── size/        # 尺寸规范定义
│   ├── components/      # 组件库
│   │   ├── basic/       # 基础UI组件
│   │   └── business/    # 业务逻辑组件
│   ├── layouts/         # 布局系统
│   │   ├── Header.vue
│   │   ├── SideBar.vue
│   │   ├── TabBar.vue
│   │   └── MainLayout.vue
│   ├── router/          # 路由管理
│   │   ├── index.ts         # 路由配置
│   │   ├── routes.ts        # 静态路由
│   │   ├── dynamicRoutes.ts # 动态路由
│   │   └── guards.ts        # 路由守卫
│   ├── stores/          # 状态管理
│   │   ├── auth.ts          # 认证状态
│   │   ├── permission.ts    # 权限状态
│   │   ├── theme.ts         # 主题状态
│   │   └── user.ts          # 用户状态
│   ├── services/        # API服务
│   │   ├── http.ts          # HTTP配置
│   │   ├── websocket.ts     # WebSocket配置
│   │   └── api/             # API接口定义
│   ├── views/           # 页面视图
│   │   ├── home/            # 首页
│   │   ├── user/            # 用户管理
│   │   ├── permission/      # 权限管理
│   │   ├── log/             # 日志管理
│   │   └── profile/         # 个人中心
│   └── types/           # 类型定义
└── document/            # 项目文档
```

## 快速开始

> [!IMPORTANT]
> 需要先启动后端服务

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发

```bash
npm run dev
```

访问：http://localhost:5173

### 默认账号

| 用户名 | 密码 |
|--------|------|
| 100001 | Am20250914 |

详细说明：[快速开始文档](document/1.快速开始.md)

## 功能展示

> [!NOTE]
> 以下展示系统的主要功能界面

### 系统仪表盘

![image-20251229162718357](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162718357.png)

- 用户统计数据可视化
- 系统运行状态监控
- 数据趋势图表
- 公告通知

### 用户管理

![image-20251229162733523](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162733523.png)

- 用户列表（分页、筛选）
- 批量操作
- 角色分配
- 密码重置

### 角色管理

![image-20251229162746239](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162746239.png)

- 角色层次树
- 权限分配
- 权限预览

### 菜单管理

![image-20251229162756495](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162756495.png)

![image-20251229162811267](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162811267.png)

- 菜单树管理
- 权限码配置
- 图标选择器

### 个人设置

![image-20251229162831895](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162831895.png)

![image-20251229162850264](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162850264.png)

![image-20251229162903581](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162903581.png)

![image-20251229162951486](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/image-20251229162951486.png)

- 个人资料维护
- 主题定制
- 布局模式切换
- 密码修改

## 界面特色

### 智能主题系统
- 自适应主题：跟随系统偏好或手动切换
- 色彩一致性：Element Plus主题色与自定义色彩完美融合
- 平滑过渡：主题切换时的流畅动画效果

### 性能优化
- 路由懒加载：页面组件按需加载，提升首屏速度
- 状态持久化：关键状态本地持久化，刷新不丢失
- 组件缓存：支持页面缓存，提升用户体验

## 相关项目

- **后端项目**: [Auth Matrix Backend](https://github.com/thirty30ww/auth-matrix-backend) - Spring Boot 权限管理后端
- **元仓库**: [Auth Matrix](https://github.com/thirty30ww/auth-matrix) - 包含前后端项目及版本发布的元仓库

## 开源协议

本项目基于 [MIT](LICENSE) 协议开源，支持商业使用和二次开发。

---

如果这个项目对你有帮助，欢迎给个 Star 支持一下

