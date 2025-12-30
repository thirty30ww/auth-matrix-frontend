# AmHeaderIcon 表头图标组件

## 概述

`AmHeaderIcon` 是一个用于表格列头的图标组件，提供激活状态和点击交互功能。通常作为 `AmSortHeader` 和 `AmFilterHeader` 的内部组件使用。

## 基础用法

```vue
<template>
  <AmHeaderIcon 
    :active="isActive"
    @click="handleClick"
  >
    <Filter />
  </AmHeaderIcon>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Filter } from '@element-plus/icons-vue'
import AmHeaderIcon from '@/components/basic/AmHeaderIcon.vue'

const isActive = ref(false)

const handleClick = () => {
  isActive.value = !isActive.value
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| active | 是否激活状态 | `boolean` | `false` |
| clickable | 是否可点击 | `boolean` | `true` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| click | 点击图标时触发（仅在 clickable 为 true 时） | - |

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 图标内容（通常是 Element Plus 图标组件） |

## 示例

### 自定义表头图标

```vue
<template>
  <span>
    <span>列标题</span>
    <AmHeaderIcon 
      :active="hasFilter"
      @click="openFilterMenu"
    >
      <Filter />
    </AmHeaderIcon>
  </span>
</template>
```

### 不可点击的图标

```vue
<template>
  <AmHeaderIcon 
    :active="true"
    :clickable="false"
  >
    <InfoFilled />
  </AmHeaderIcon>
</template>
```

## 特性

- 激活状态自动高亮（主题色）
- 未激活状态半透明显示
- 悬停时放大效果
- 可控制是否可点击
- 使用 BEM 命名规范
