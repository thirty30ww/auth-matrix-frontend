# AmAvatar 头像组件

## 概述

`AmAvatar` 是一个增强的头像组件，支持单个头像和头像组模式，提供堆叠显示、动画效果等功能。

## 基础用法

### 单个头像

```vue
<template>
  <AmAvatar 
    src="https://example.com/avatar.jpg" 
    alt="用户头像"
    size="large"
  />
</template>
```

### 头像组

```vue
<template>
  <AmAvatar 
    mode="group"
    :avatars="avatarList"
    :max="5"
    :overlap="8"
    @avatar-click="handleAvatarClick"
  />
</template>

<script setup lang="ts">
const avatarList = [
  { id: 1, src: 'https://example.com/avatar1.jpg', alt: '用户1' },
  { id: 2, src: 'https://example.com/avatar2.jpg', alt: '用户2' },
  { id: 3, src: 'https://example.com/avatar3.jpg', alt: '用户3' }
]

const handleAvatarClick = (avatar: any, index: number) => {
  console.log('点击头像', avatar, index)
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| mode | 模式：单个头像或头像组 | `'single' \| 'group'` | `'single'` |
| avatars | 头像组数据（group 模式） | `AvatarItem[]` | `[]` |
| max | 最多显示头像数量 | `number` | `5` |
| overlap | 头像重叠像素 | `number` | `8` |
| showMore | 是否显示更多提示 | `boolean` | `true` |
| moreText | 更多提示文本模板 | `string` | `'+{count}'` |
| srcField | 头像 src 字段名 | `string` | `'src'` |
| altField | 头像 alt 字段名 | `string` | `'alt'` |
| animated | 是否启用动画 | `boolean` | `false` |
| animationDelay | 动画延迟（毫秒） | `number` | `0` |
| size | 头像大小 | `number \| 'large' \| 'default' \| 'small'` | `'default'` |
| shape | 头像形状 | `'circle' \| 'square'` | `'circle'` |
| icon | 图标组件 | `any` | - |
| src | 图片地址（single 模式） | `string` | - |
| alt | 图片描述 | `string` | - |
| fit | 图片填充方式 | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | - |

### AvatarItem 类型

```typescript
interface AvatarItem {
  id?: string | number
  src?: string
  icon?: any
  alt?: string
  [key: string]: any
}
```

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| avatar-click | 点击头像时触发 | `(avatar: AvatarItem, index: number)` |
| more-click | 点击更多按钮时触发 | `(remainingCount: number)` |

## Slots

| 插槽名 | 说明 | 作用域参数 |
|--------|------|-----------|
| default | 单个头像模式的默认内容 | - |
| avatar | 自定义头像内容 | `{ avatar, index }` |
| more | 自定义更多按钮内容 | `{ count }` |

## 示例

### 带动画的头像组

```vue
<template>
  <AmAvatar 
    mode="group"
    :avatars="users"
    :max="4"
    :overlap="10"
    animated
    :animation-delay="100"
    @avatar-click="viewUserProfile"
    @more-click="showAllUsers"
  />
</template>
```

### 自定义字段映射

```vue
<template>
  <AmAvatar 
    mode="group"
    :avatars="members"
    src-field="avatarUrl"
    alt-field="name"
  />
</template>

<script setup lang="ts">
const members = [
  { id: 1, avatarUrl: 'url1.jpg', name: '张三' },
  { id: 2, avatarUrl: 'url2.jpg', name: '李四' }
]
</script>
```

## 特性

- 支持单个头像和头像组两种模式
- 头像组支持堆叠显示，可自定义重叠像素
- 支持渐入动画效果
- 悬停时头像上浮效果
- 自动显示剩余头像数量
- 灵活的字段映射配置
