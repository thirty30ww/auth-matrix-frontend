# AmActionLinks 操作链接组件

## 概述

`AmActionLinks` 是一个用于在表格操作列中显示多个操作链接的组件，支持不同类型的操作样式和禁用状态。

## 基础用法

```vue
<template>
  <AmActionLinks :actions="actionLinks" />
</template>

<script setup lang="ts">
import AmActionLinks from '@/components/basic/AmActionLinks.vue'

const actionLinks = [
  {
    label: '编辑',
    onClick: () => handleEdit(),
    type: 'default'
  },
  {
    label: '删除',
    onClick: () => handleDelete(),
    type: 'danger'
  }
]
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| actions | 操作链接配置数组 | `ActionLink[]` | - |

### ActionLink 类型

```typescript
interface ActionLink {
  label: string           // 链接文本
  onClick: () => void     // 点击回调
  disabled?: boolean      // 是否禁用
  type?: 'default' | 'danger' | 'success'  // 链接类型
}
```

## 示例

### 表格中使用

```vue
<template>
  <el-table :data="tableData">
    <el-table-column label="操作" width="150" align="center">
      <template #default="{ row }">
        <AmActionLinks :actions="getActionLinks(row)" />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
const getActionLinks = (row: any) => [
  {
    label: '修改',
    onClick: () => handleEdit(row),
    disabled: !row.hasPermission,
    type: 'default'
  },
  {
    label: '封禁',
    onClick: () => handleBan(row),
    disabled: !row.hasPermission,
    type: 'danger'
  },
  {
    label: '启用',
    onClick: () => handleEnable(row),
    type: 'success'
  }
]
</script>
```

## 特性

- 自动阻止事件冒泡，避免触发父元素点击事件
- 支持三种类型样式：default（主色）、danger（危险色）、success（成功色）
- 支持禁用状态
- 链接之间自动添加分隔线
