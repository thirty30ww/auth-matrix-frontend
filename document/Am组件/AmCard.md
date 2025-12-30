# AmCard 卡片组件

## 概述

`AmCard` 是一个增强的卡片组件，基于 Element Plus 的 `el-card`，提供灵活的内边距控制。

## 基础用法

```vue
<template>
  <AmCard>
    <p>这是卡片内容</p>
  </AmCard>
</template>
```

## 自定义内边距

### 使用数字

```vue
<template>
  <AmCard :padding="30">
    <p>内边距为 30px</p>
  </AmCard>
</template>
```

### 使用字符串

```vue
<template>
  <AmCard padding="20px 40px">
    <p>上下 20px，左右 40px</p>
  </AmCard>
</template>
```

### 移除内边距

```vue
<template>
  <AmCard no-padding>
    <div style="padding: 0;">无内边距内容</div>
  </AmCard>
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| padding | 自定义 body 内边距 | `string \| number` | - |
| headerPadding | 自定义 header 内边距 | `string \| number` | - |
| noPadding | 是否移除 body 所有内边距 | `boolean` | `false` |

> 注意：`AmCard` 继承 `el-card` 的所有 props，如 `shadow`、`body-style` 等。

## Slots

| 插槽名 | 说明 |
|--------|------|
| default | 卡片内容 |
| header | 卡片头部 |

## 示例

### 带标题的卡片

```vue
<template>
  <AmCard :padding="20">
    <template #header>
      <div class="card-header">
        <span>用户信息</span>
      </div>
    </template>
    <p>姓名：张三</p>
    <p>年龄：25</p>
  </AmCard>
</template>
```

### 自定义头部内边距

```vue
<template>
  <AmCard 
    :padding="30" 
    :header-padding="15"
  >
    <template #header>
      <h3>标题</h3>
    </template>
    <p>内容区域</p>
  </AmCard>
</template>
```

### 无内边距卡片（适合放置表格）

```vue
<template>
  <AmCard no-padding>
    <el-table :data="tableData">
      <!-- 表格列 -->
    </el-table>
  </AmCard>
</template>
```

### 结合 Element Plus 属性

```vue
<template>
  <AmCard 
    shadow="hover" 
    :padding="25"
  >
    <p>鼠标悬停时显示阴影</p>
  </AmCard>
</template>
```

## 特性

- 继承 Element Plus Card 的所有功能
- 灵活的内边距控制（支持数字和字符串）
- 可分别控制 body 和 header 的内边距
- 支持完全移除内边距
- 使用 CSS 变量实现，样式优先级高
