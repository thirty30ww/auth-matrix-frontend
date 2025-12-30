# AmButton 按钮组件

## 概述

`AmButton` 是一个增强的按钮组件，基于 Element Plus 的 `el-button`，提供自动 loading 状态管理功能。

## 基础用法

```vue
<template>
  <AmButton @click="handleClick">
    点击我
  </AmButton>
</template>

<script setup lang="ts">
const handleClick = () => {
  console.log('按钮被点击')
}
</script>
```

## 自动 Loading

当按钮点击事件返回 Promise 时，可以自动管理 loading 状态：

```vue
<template>
  <AmButton 
    auto-loading 
    @click="handleAsyncClick"
  >
    提交
  </AmButton>
</template>

<script setup lang="ts">
const handleAsyncClick = async () => {
  // 按钮会自动显示 loading 状态
  await api.submitData()
  // loading 状态自动结束
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| loading | 手动控制 loading 状态 | `boolean` | `false` |
| autoLoading | 是否自动处理异步 loading | `boolean` | `false` |

> 注意：`AmButton` 继承 `el-button` 的所有 props，如 `type`、`size`、`disabled` 等。

## 示例

### 手动控制 Loading

```vue
<template>
  <AmButton 
    :loading="isLoading" 
    @click="handleClick"
  >
    保存
  </AmButton>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isLoading = ref(false)

const handleClick = async () => {
  isLoading.value = true
  try {
    await api.save()
  } finally {
    isLoading.value = false
  }
}
</script>
```

### 自动 Loading（推荐）

```vue
<template>
  <AmButton 
    auto-loading 
    type="primary"
    @click="handleSubmit"
  >
    提交表单
  </AmButton>
</template>

<script setup lang="ts">
const handleSubmit = async () => {
  // 自动显示 loading，无需手动管理状态
  await submitForm()
  ElMessage.success('提交成功')
}
</script>
```

### 结合表单使用

```vue
<template>
  <el-form @submit.prevent="handleSubmit">
    <el-form-item>
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item>
      <AmButton 
        auto-loading 
        type="primary" 
        native-type="submit"
        @click="handleSubmit"
      >
        提交
      </AmButton>
    </el-form-item>
  </el-form>
</template>
```

## 特性

- 继承 Element Plus Button 的所有功能
- 自动处理异步操作的 loading 状态
- loading 期间自动禁用按钮
- 支持手动和自动两种 loading 模式
- 错误处理由调用方控制
