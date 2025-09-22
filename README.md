# 🎨 Auth Matrix Frontend

> 基于 Vue3 + Element Plus 的企业级权限管理系统前端 - 现代化设计，智能交互，极致体验

[![Vue](https://img.shields.io/badge/Vue-3.5.17-green)](https://vuejs.org/)
[![Element Plus](https://img.shields.io/badge/Element%20Plus-2.10.4-blue)](https://element-plus.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## ✨ 核心特色

### 🎯 智能权限控制
- **四级权限粒度**：目录→菜单→页面→按钮的完整权限控制链路
- **动态路由加载**：基于用户角色实时生成个性化路由和菜单
- **权限指令系统**：`v-permission` 指令实现组件级权限控制

### 🎨 现代化UI设计
- **双主题无缝切换**：明暗主题智能切换，支持系统偏好自动适配
- **响应式布局系统**：Header/Sidebar双布局模式，适配各种屏幕尺寸
- **流畅动画体验**：页面切换、主题变更、加载状态的精心动画设计

### 🚀 开发体验优化
- **TypeScript全覆盖**：完整类型定义，IDE智能提示和编译时检查
- **Pinia状态管理**：模块化状态管理，支持持久化和开发工具
- **组件化架构**：业务组件与基础组件分离，高度可复用

## 🛠️ 技术栈

**核心框架**：Vue 3.5.17 + TypeScript 5.8.3 + Vite 7.0.4  
**UI组件库**：Element Plus 2.10.4 + Element Plus Icons  
**状态管理**：Pinia 3.0.3 + 持久化插件  
**路由管理**：Vue Router 4.5.1 + 动态路由  
**HTTP客户端**：Axios 1.10.0 + 请求拦截器  
**开发工具**：VueUse 13.7.0 + Vue DevTools

## 📁 项目架构

```
frontend/
├── 🎨 src/assets/         # 静态资源 - 图标、样式、主题系统
│   ├── icon/              # SVG图标资源
│   └── style/             # 模块化样式系统
│       ├── animations/    # 动画效果定义
│       ├── color/         # 主题色彩方案
│       └── size/          # 尺寸规范定义
├── 🧩 src/components/     # 组件库 - 业务组件与基础组件
│   ├── basic/             # 基础UI组件
│   └── business/          # 业务逻辑组件
├── 🏗️ src/layouts/        # 布局系统 - Header/Sidebar双模式布局
├── 🛣️ src/router/         # 路由管理 - 动态路由与权限守卫
├── 📦 src/stores/         # 状态管理 - Pinia模块化状态
├── 🔧 src/services/       # API服务 - HTTP请求与接口定义
├── 📋 src/views/          # 页面视图 - 业务功能页面
└── 🎯 src/types/          # 类型定义 - 完整TypeScript类型系统
```

## ⚡ 快速启动

> 💡 详细部署步骤请按顺序阅读：[快速开始](document/1.快速开始.md)

> 💡 **前置条件**：需要先启动 [Auth Matrix Backend](https://github.com/thirty30ww/auth-matrix-backend)后端服务

## 🎯 权限管理界面

### 👥 用户管理系统
![image-20250920205625226](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202056237.png)

- **用户列表**：分页查询、高级筛选、批量操作
- **用户详情**：基本信息、角色分配、权限查看
- **用户操作**：新增、编辑、禁用、密码重置

### 🎭 角色权限配置
![image-20250920205731428](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202057973.png)

- **角色层次**：树形结构展示角色等级关系
- **权限分配**：菜单权限、按钮权限可视化配置
- **权限预览**：实时预览角色权限范围

### 📋 菜单权限管理
![image-20250920205812096](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202058943.png)

![image-20250920205836565](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202058290.png)

- **菜单树管理**：拖拽排序、层级调整
- **权限码配置**：细粒度权限控制设置
- **图标选择器**：内置图标库，支持自定义图标

### ⚙️ 个人设置中心
![image-20250920205924850](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202059656.png)

![image-20250920205958017](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202059436.png)

![image-20250920210016477](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202100486.png)

![image-20250920210103978](https://thirty30ww.oss-cn-hangzhou.aliyuncs.com/hosting/202509202101583.png)

- **主题定制**：明暗主题、布局模式切换
- **个人资料**：头像上传、基本信息维护
- **安全设置**：密码修改、安全选项配置

## 🎨 界面特色

### 🌓 智能主题系统
- **自适应主题**：跟随系统偏好或手动切换
- **色彩一致性**：Element Plus主题色与自定义色彩完美融合
- **平滑过渡**：主题切换时的流畅动画效果

### ⚡ 性能优化
- **路由懒加载**：页面组件按需加载，提升首屏速度
- **状态持久化**：关键状态本地持久化，刷新不丢失

## 🔗 生态项目

- **后端项目**：[Auth Matrix Backend](https://github.com/thirty30ww/auth-matrix-backend) - Spring Boot权限管理后端
- **元仓库**：[Auth Matrix](https://github.com/thirty30ww/auth-matrix) - 包含前端、后端项目及发布的版本的元仓库
- **部署方案**：支持Docker容器化部署和传统部署方式

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源，支持商业使用和二次开发。

---

**🌟 现代化权限管理前端解决方案，如果对你有帮助请给个Star！**

**🔗 配套后端项目**：[Auth Matrix Backend →](https://github.com/thirty30ww/auth-matrix-backend)

