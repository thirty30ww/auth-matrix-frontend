# Am 组件库

## 概述

Am 组件库是基于 Element Plus 封装的业务组件集合，提供更便捷的使用方式和更丰富的功能。所有组件以 `Am` 前缀命名。

## 组件列表

### 基础组件

- [AmButton](./AmButton.md) - 增强按钮，支持自动 loading
- [AmCard](./AmCard.md) - 增强卡片，灵活的内边距控制
- [AmDialog](./AmDialog.md) - 增强对话框，灵活的内边距控制
- [AmAvatar](./AmAvatar.md) - 头像组件，支持单个和头像组模式
- [AmActionLinks](./AmActionLinks.md) - 操作链接，用于表格操作列

### 表格组件

- [AmSortHeader](./AmSortHeader.md) - 可排序表头
- [AmFilterHeader](./AmFilterHeader.md) - 可筛选表头
- [AmHeaderIcon](./AmHeaderIcon.md) - 表头图标

## 快速开始

```vue
<script setup lang="ts">
import AmButton from '@/components/basic/AmButton.vue'
import AmCard from '@/components/basic/AmCard.vue'
import AmDialog from '@/components/basic/AmDialog.vue'
</script>

<template>
  <AmCard :padding="20">
    <h3>用户信息</h3>
    <p>内容区域</p>
    
    <AmButton auto-loading @click="handleSubmit">
      提交
    </AmButton>
  </AmCard>
</template>
```

## 常见使用场景

### 表格操作列

```vue
<el-table-column label="操作" width="150">
  <template #default="{ row }">
    <AmActionLinks :actions="getActions(row)" />
  </template>
</el-table-column>
```

### 表格排序和筛选

```vue
<el-table-column prop="createTime" label="创建时间">
  <template #header="{ column }">
    <AmSortHeader 
      :label="column.label"
      field="createTime"
      :sort="sortInfo"
      @change="handleSort"
    />
  </template>
</el-table-column>

<el-table-column prop="status" label="状态">
  <template #header="{ column }">
    <AmFilterHeader 
      :label="column.label"
      :options="statusOptions"
      v-model="filterStatus"
    />
  </template>
</el-table-column>
```

### 表单对话框

```vue
<AmDialog 
  v-model:visible="visible"
  title="编辑用户"
  :padding="20"
>
  <el-form :model="form">
    <!-- 表单项 -->
  </el-form>
  
  <template #footer>
    <AmButton @click="visible = false">取消</AmButton>
    <AmButton type="primary" auto-loading @click="handleSubmit">
      提交
    </AmButton>
  </template>
</AmDialog>
```

## 设计原则

- **简洁易用** - 提供简洁的 API，减少样板代码
- **类型安全** - 完整的 TypeScript 类型定义
- **灵活扩展** - 继承 Element Plus 组件的所有功能
- **统一风格** - 保持一致的使用方式和命名规范
